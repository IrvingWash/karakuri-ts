import { ensureExists } from "../../utils/existence-ensurer";
import { type RGBA } from "../objects";
import type { DrawData, SpritePipeline, Texture } from "./sprite-renderer-objects";
import { type IOrthogonalProjection } from "../orthogonal-projection";
import { type ISpriteRenderer } from "./isprite-renderer";
import { BatchDrawCall } from "./batch-draw-call";
import { spriteShader } from "./shaders/sprite-shader";

const MAX_SPRITE_COUNT_PER_BUFFER = 1000;
const INDICES_PER_SPRITE = 6;
const ATTRIBUTES_PER_VERTEX = 8;
const ATTRIBUTES_PER_SPRITE = ATTRIBUTES_PER_VERTEX * 4;

export class SpriteRenderer implements ISpriteRenderer {
    public readonly device: GPUDevice;

    private readonly _ctx: GPUCanvasContext;
    private readonly _orthogonalProjection: IOrthogonalProjection;
    private readonly _clearColor: RGBA;

    private _commandEncoder: GPUCommandEncoder | null = null;
    private _renderPassEncoder: GPURenderPassEncoder | null = null;

    private _currentTexture: Texture | null = null;
    private readonly _pipelinesPerTexture: Map<string, SpritePipeline> = new Map();
    private readonly _batchDrawCallsPerTexture: Map<string, BatchDrawCall[]> = new Map(); // TODO: Consider using a Set instead of Array
    private readonly _allocatedVertexBuffers: GPUBuffer[] = [];

    private readonly _projectionMatrixBindGroupLayout: GPUBindGroupLayout;
    private _projectionMatrixBindGroup: GPUBindGroup | null = null;
    private readonly _projectionMatrixBuffer: GPUBuffer;

    private readonly _quadIndexBuffer: GPUBuffer;

    public constructor(device: GPUDevice, ctx: GPUCanvasContext, orthogonalProjection: IOrthogonalProjection, clearColor: RGBA) {
        this.device = device;
        this._ctx = ctx;
        this._orthogonalProjection = orthogonalProjection;
        this._clearColor = clearColor;

        this._quadIndexBuffer = this._createQuadIndexBuffer();

        this._projectionMatrixBuffer = this._createBuffer(
            this._orthogonalProjection.projectionMatrix.values.byteLength,
            GPUBufferUsage.UNIFORM,
        );

        this._projectionMatrixBindGroupLayout = this.device.createBindGroupLayout({
            label: "View port bind group layout",
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: {
                    type: "uniform",
                },
            }],
        });
    }

    public queueDraw(drawData: DrawData): void {
        if (this._renderPassEncoder === null || this._commandEncoder === null) {
            return;
        }

        const { texture, vertices } = drawData;

        if (this._currentTexture !== texture) {
            this._switchTexture(texture);
        }

        const texturePipeline = ensureExists(this._pipelinesPerTexture.get(texture.id));
        const batchDrawCall = this._getOrCreateBatchDrawCall(texture, texturePipeline);

        this._addVerticesIntoBatchDrawCall(batchDrawCall, vertices);

        batchDrawCall.incrementInstanceCount();

        if (batchDrawCall.getInstanceCount() >= MAX_SPRITE_COUNT_PER_BUFFER) {
            this._addBatchDrawCallToTexture(texture, texturePipeline);
        }
    }

    public beginDrawing(): void {
        this._commandEncoder = this.device.createCommandEncoder({
            label: "Filled rectangle drawing command encoder",
        });

        this._renderPassEncoder = this._createRenderPassEncoder(this._commandEncoder, this._clearColor);

        this._currentTexture = null;
        this._batchDrawCallsPerTexture.clear();

        // TODO: Update camera

        this._projectionMatrixBindGroup = this.device.createBindGroup({
            layout: this._projectionMatrixBindGroupLayout,
            entries: [{
                binding: 0,
                resource: {
                    buffer: this._projectionMatrixBuffer,
                },
            }],
        });

        this.device.queue.writeBuffer(this._projectionMatrixBuffer, 0, this._orthogonalProjection.projectionMatrix.values);
    }

    public finishDrawing(): void {
        if (this._commandEncoder === null || this._renderPassEncoder === null) {
            return;
        }

        const usedVertexBuffers: GPUBuffer[] = [];

        for (const textureBatchDrawCalls of this._batchDrawCallsPerTexture.values()) {
            for (const batchDrawCall of textureBatchDrawCalls) {
                if (batchDrawCall.getInstanceCount() === 0) {
                    continue;
                }

                let vertexBuffer = this._allocatedVertexBuffers.pop();
                if (vertexBuffer === undefined) {
                    vertexBuffer = this._createAndWriteBuffer(batchDrawCall.vertexData, GPUBufferUsage.VERTEX);
                } else {
                    this.device.queue.writeBuffer(vertexBuffer, 0, batchDrawCall.vertexData);
                }

                usedVertexBuffers.push(vertexBuffer);

                const pipeline = batchDrawCall.pipeline;

                this._renderPassEncoder.setPipeline(pipeline.pipeline);
                this._renderPassEncoder.setBindGroup(0, this._projectionMatrixBindGroup);
                this._renderPassEncoder.setBindGroup(1, pipeline.textureBindGroup);
                this._renderPassEncoder.setVertexBuffer(0, vertexBuffer);
                this._renderPassEncoder.setIndexBuffer(this._quadIndexBuffer, "uint16");

                this._renderPassEncoder.drawIndexed(6 * batchDrawCall.getInstanceCount());
            }
        }

        this._allocatedVertexBuffers.push(...usedVertexBuffers);

        this._renderPassEncoder.end();

        this.device.queue.submit([this._commandEncoder.finish()]);
    }

    private _createAndWriteBuffer(
        data: Float32Array | Uint16Array,
        type: GPUFlagsConstant,
        label?: string,
    ): GPUBuffer {
        const buffer = this._createBuffer(
            data.byteLength,
            type,
            label,
        );

        this.device.queue.writeBuffer(buffer, 0, data);

        return buffer;
    }

    private _createBuffer(byteLength: number, type: GPUFlagsConstant, label?: string): GPUBuffer {
        const buffer = this.device.createBuffer({
            label,
            size: byteLength,
            usage: type | GPUBufferUsage.COPY_DST,
            mappedAtCreation: false,
        });

        return buffer;
    }

    private _switchTexture(texture: Texture): void {
        this._currentTexture = texture;

        let pipeline = this._pipelinesPerTexture.get(texture.id);
        if (pipeline === undefined) {
            pipeline = this._createSpritePipeline(spriteShader, texture);

            this._pipelinesPerTexture.set(texture.id, pipeline);
        }

        let batchDrawCalls = this._batchDrawCallsPerTexture.get(texture.id);
        if (batchDrawCalls === undefined) {
            this._batchDrawCallsPerTexture.set(texture.id, []);
        }
    }

    private _getOrCreateBatchDrawCall(texture: Texture, texturePipeline: SpritePipeline): BatchDrawCall {
        const textureBatchDrawCalls = this._batchDrawCallsPerTexture.get(texture.id);

        let batchDrawCall = textureBatchDrawCalls?.at(-1);
        if (batchDrawCall === undefined) {
            batchDrawCall = new BatchDrawCall(texturePipeline, MAX_SPRITE_COUNT_PER_BUFFER, ATTRIBUTES_PER_SPRITE);

            this._batchDrawCallsPerTexture.get(texture.id)?.push(batchDrawCall);
        }

        return batchDrawCall;
    }

    private _addVerticesIntoBatchDrawCall(batchDrawCall: BatchDrawCall, vertices: number[]): void {
        let index = batchDrawCall.getInstanceCount() * ATTRIBUTES_PER_SPRITE;

        for (let i = 0; i < ATTRIBUTES_PER_SPRITE; i++) {
            batchDrawCall.vertexData[i + index] = ensureExists(vertices[i]);
        }
    }

    private _addBatchDrawCallToTexture(texture: Texture, texturePipeline: SpritePipeline): void {
        const newBatch = new BatchDrawCall(texturePipeline, MAX_SPRITE_COUNT_PER_BUFFER, ATTRIBUTES_PER_SPRITE);

        this._batchDrawCallsPerTexture.get(texture.id)?.push(newBatch);
    }

    private _createRenderPassEncoder(
        commandEncoder: GPUCommandEncoder,
        clearValue: RGBA,
        label?: string,
    ): GPURenderPassEncoder {
        return commandEncoder.beginRenderPass({
            label,
            colorAttachments: [{
                loadOp: "clear",
                storeOp: "store",
                view: this._ctx.getCurrentTexture().createView(),
                clearValue,
            }],
        });
    }

    private _createSpritePipeline(shader: string, texture: Texture): SpritePipeline {
        const shaderModule = this.device.createShaderModule({
            label: "Sprite shader module",
            code: shader,
        });

        const vertexBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 8 * Float32Array.BYTES_PER_ELEMENT,
            attributes: [
                {
                    shaderLocation: 0,
                    offset: 0,
                    format: "float32x2",
                },
                {
                    shaderLocation: 1,
                    offset: 2 * Float32Array.BYTES_PER_ELEMENT,
                    format: "float32x2",
                },
                {
                    shaderLocation: 2,
                    offset: 4 * Float32Array.BYTES_PER_ELEMENT,
                    format: "float32x4",
                },
            ],
            stepMode: "vertex",
        };

        const textureBindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {},
                },
            ],
        });

        const bindGroup = this.device.createBindGroup({
            layout: textureBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: texture.sampler,
                },
                {
                    binding: 1,
                    resource: texture.texture.createView(),
                },
            ],
        });

        const pipeline = this.device.createRenderPipeline({
            label: "Sprite render pipeline",
            layout: this.device.createPipelineLayout({
                bindGroupLayouts: [
                    this._projectionMatrixBindGroupLayout,
                    textureBindGroupLayout,
                ],
            }),
            primitive: {
                topology: "triangle-list",
            },
            vertex: {
                module: shaderModule,
                entryPoint: "vs_main",
                buffers: [vertexBufferLayout],
            },
            fragment: {
                module: shaderModule,
                entryPoint: "fs_main",
                targets: [{
                    format: navigator.gpu.getPreferredCanvasFormat(),
                    blend: {
                        color: {
                            srcFactor: "src-alpha",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add",
                        },
                        alpha: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add",
                        },
                    },
                }],
            },
        });

        return {
            pipeline,
            textureBindGroup: bindGroup,
        };
    }

    private _createQuadIndexBuffer(): GPUBuffer {
        const data = new Uint16Array(MAX_SPRITE_COUNT_PER_BUFFER * INDICES_PER_SPRITE);

        for (let i = 0; i < MAX_SPRITE_COUNT_PER_BUFFER; i++) {
            // triangle 1
            data[i * INDICES_PER_SPRITE + 0] = i * 4 + 0;
            data[i * INDICES_PER_SPRITE + 1] = i * 4 + 1;
            data[i * INDICES_PER_SPRITE + 2] = i * 4 + 2;

            // triangle 2
            data[i * INDICES_PER_SPRITE + 3] = i * 4 + 2;
            data[i * INDICES_PER_SPRITE + 4] = i * 4 + 3;
            data[i * INDICES_PER_SPRITE + 5] = i * 4 + 0;
        }

        return this._createAndWriteBuffer(data, GPUBufferUsage.INDEX);
    }
}
