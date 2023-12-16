import { ensureExists } from "../../../utils/existence-ensurer";
import { RGBA } from "../../objects";
import { SpritePipeline, Texture } from "../renderer-objects";
import { type IViewPort } from "../view-port";
import { IRenderer } from "./irenderer";

const MAX_SPRITE_COUNT_PER_BUFFER = 1000;
const INDICES_PER_SPRITE = 6;
const ATTRIBUTES_PER_VERTEX = 8;
const ATTRIBUTES_PER_SPRITE = ATTRIBUTES_PER_VERTEX * 4;

class BatchDrawCall {
    public pipeline: SpritePipeline;
    public vertexData: Float32Array;

    private _instanceCount: number;

    public constructor(pipeline: SpritePipeline) {
        this.pipeline = pipeline;
        this.vertexData = new Float32Array(MAX_SPRITE_COUNT_PER_BUFFER * ATTRIBUTES_PER_SPRITE);
        this._instanceCount = 0;
    }

    public incrementInstanceCount(): void {
        this._instanceCount++;
    }

    public getInstanceCount(): number {
        return this._instanceCount;
    }
}

export class Renderer implements IRenderer {
    public readonly device: GPUDevice;

    private readonly _ctx: GPUCanvasContext;
    private readonly _viewPort: IViewPort;
    private readonly _clearColor: RGBA;

    private _commandEncoder: GPUCommandEncoder | null = null;
    private _renderPassEncoder: GPURenderPassEncoder | null = null;

    private readonly _viewPortBindGroupLayout: GPUBindGroupLayout;
    private readonly _pipelinesPerTexture: Map<string, SpritePipeline> = new Map();
    private readonly _batchDrawCallsPerTexture: Map<string, BatchDrawCall[]> = new Map(); // TODO: Consider using a Set instead of Array
    private readonly _allocatedVertexBuffers: GPUBuffer[] = [];
    private _currentTexture: Texture | null = null;
    private readonly _quadIndexBuffer: GPUBuffer;

    public constructor(device: GPUDevice, ctx: GPUCanvasContext, viewPort: IViewPort, clearColor: RGBA) {
        this.device = device;
        this._ctx = ctx;
        this._viewPort = viewPort;
        this._clearColor = clearColor;

        this._viewPortBindGroupLayout = this.device.createBindGroupLayout({
            label: "View port bind group layout",
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: {
                    type: "uniform",
                },
            }],
        });

        this._quadIndexBuffer = this._createQuadIndexBuffer();
    }

    public queueDraw(vertices: number[], texture: Texture, shader: string): void {
        // TODO: the contents of this if statement need to be moved into a separate method.
        if (this._currentTexture !== texture) {
            this._currentTexture = texture;

            if (this._renderPassEncoder === null || this._commandEncoder === null) {
                return;
            }

            let pipeline = this._pipelinesPerTexture.get(texture.id);
            if (pipeline === undefined) {
                pipeline = this._createSpritePipeline(shader, texture);

                this._pipelinesPerTexture.set(texture.id, pipeline);
            }

            let batchDrawCalls = this._batchDrawCallsPerTexture.get(texture.id);
            if (batchDrawCalls === undefined) {
                this._batchDrawCallsPerTexture.set(texture.id, []);
            }
        }

        const texturePipeline = ensureExists(this._pipelinesPerTexture.get(texture.id));

        const textureBatchDrawCalls = this._batchDrawCallsPerTexture.get(texture.id);

        let batchDrawCall = textureBatchDrawCalls?.at(-1);
        if (batchDrawCall === undefined) {
            batchDrawCall = new BatchDrawCall(texturePipeline);

            this._batchDrawCallsPerTexture.get(texture.id)?.push(batchDrawCall);
        }

        let index = batchDrawCall.getInstanceCount() * ATTRIBUTES_PER_SPRITE;

        for (let i = 0; i < ATTRIBUTES_PER_SPRITE; i++) {
            batchDrawCall.vertexData[i + index] = ensureExists(vertices[i]);
        }

        batchDrawCall.incrementInstanceCount();

        if (batchDrawCall.getInstanceCount() >= MAX_SPRITE_COUNT_PER_BUFFER) {
            const newBatch = new BatchDrawCall(texturePipeline);

            this._batchDrawCallsPerTexture.get(texture.id)?.push(newBatch);
        }
    }

    public beginDrawing(): void {
        this._commandEncoder = this.device.createCommandEncoder({
            label: "Filled rectangle drawing command encoder",
        });

        this._renderPassEncoder = this._createRenderPassEncoder(this._commandEncoder, this._clearColor);

        this._batchDrawCallsPerTexture.clear();
    }

    public finishDrawing(): void {
        if (this._commandEncoder === null || this._renderPassEncoder === null) {
            return;
        }

        let usedVertexBuffers: GPUBuffer[] = [];

        for (const textureBatchDrawCalls of this._batchDrawCallsPerTexture.values()) {
            for (const batchDrawCall of textureBatchDrawCalls) {
                if (batchDrawCall.getInstanceCount() === 0) {
                    continue;
                }

                let vertexBuffer = this._allocatedVertexBuffers.pop();
                if (vertexBuffer === undefined) {
                    vertexBuffer = this._createBuffer(batchDrawCall.vertexData, GPUBufferUsage.VERTEX);
                    // TODO: Maybe we must rewrite the buffer every time
                }

                usedVertexBuffers.push(vertexBuffer);

                const pipeline = batchDrawCall.pipeline;

                this._renderPassEncoder.setPipeline(pipeline.pipeline);
                this._renderPassEncoder.setBindGroup(0, this._alignToViewPort());
                this._renderPassEncoder.setBindGroup(1, pipeline.textureBindGroup);
                this._renderPassEncoder.setVertexBuffer(0, vertexBuffer);
                this._renderPassEncoder.setIndexBuffer(this._quadIndexBuffer, "uint16");

                this._renderPassEncoder.drawIndexed(6);
            }
        }

        for (const vertexBuffer of usedVertexBuffers) {
            this._allocatedVertexBuffers.push(vertexBuffer);
        }

        this._renderPassEncoder.end();

        this.device.queue.submit([this._commandEncoder.finish()]);
    }

    private _createBuffer(
        data: Float32Array | Uint16Array,
        type: GPUFlagsConstant,
        label?: string,
    ): GPUBuffer {
        const buffer = this.device.createBuffer({
            size: data.byteLength,
            label,
            usage: type | GPUBufferUsage.COPY_DST,
        });

        this.device.queue.writeBuffer(buffer, 0, data);

        return buffer;
    }

    private _alignToViewPort(): GPUBindGroup {
        const buffer = this._createBuffer(
            this._viewPort.projectionMatrix.values,
            GPUBufferUsage.UNIFORM,
            "Viewport uniform buffer",
        );

        return this.device.createBindGroup({
            label: "View port bind group",
            layout: this._viewPortBindGroupLayout,
            entries: [{
                binding: 0,
                resource: {
                    buffer,
                },
            }],
        });
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
                    this._viewPortBindGroupLayout,
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
                            srcFactor: "one",
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

        return this._createBuffer(data, GPUBufferUsage.INDEX);
    }
}
