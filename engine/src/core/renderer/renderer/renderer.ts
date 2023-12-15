import { createBuffer } from "../renderer-uitls";
import { type IViewPort } from "../view-port";
import { IRenderer } from "./irenderer";
import { filledMonochromeShapeShader } from "./shaders/filled-monochrome-shape-shader.ts";

export class Renderer implements IRenderer {
    private readonly _device: GPUDevice;
    private readonly _ctx: GPUCanvasContext;
    private readonly _viewPort: IViewPort;

    private readonly _viewPortBindGroupLayout: GPUBindGroupLayout;

    private readonly _quadIndexBuffer: GPUBuffer;

    private readonly _filledRectanglePipeline: GPURenderPipeline;

    public constructor(device: GPUDevice, ctx: GPUCanvasContext, viewPort: IViewPort) {
        this._device = device;
        this._ctx = ctx;
        this._viewPort = viewPort;

        this._viewPortBindGroupLayout = this._device.createBindGroupLayout({
            label: "View port bind group layout",
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: {
                    type: "uniform",
                },
            }],
        });

        this._quadIndexBuffer = createBuffer(
            this._device,
            new Uint16Array([
                0, 1, 2,
                2, 3, 0,
            ]),
            GPUBufferUsage.INDEX,
        );

        this._filledRectanglePipeline = this._createFilledRectanglePipeline();
    }

    private _alignToViewPort(): GPUBindGroup {
        const buffer = createBuffer(
            this._device,
            this._viewPort.projectionMatrix.values,
            GPUBufferUsage.UNIFORM,
            "Viewport uniform buffer",
        );

        return this._device.createBindGroup({
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

    public drawFilledRectangle(
        x: number, y: number,
        width: number, height: number,
        color: [number, number, number, number],
    ): void {
        const commandEncoder = this._device.createCommandEncoder({
            label: "Filled rectangle drawing command encoder",
        });

        const renderPassEncoder = this._createRenderPassEncoder(commandEncoder, [1, 1, 1, 1]);

        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;

        const vertexData = [
            // TODO: unoptimal spread operator here
            (x + halfWidth), (y + halfHeight), ...color, // top right
            (x + halfWidth), (y - halfHeight), ...color, // bottom right
            (x - halfWidth), (y - halfHeight), ...color, // bottom left
            (x - halfWidth), (y + halfHeight), ...color, // top left
        ];

        renderPassEncoder.setPipeline(this._filledRectanglePipeline);
        renderPassEncoder.setVertexBuffer(0, createBuffer(this._device, new Float32Array(vertexData), GPUBufferUsage.VERTEX));
        renderPassEncoder.setIndexBuffer(this._quadIndexBuffer, "uint16");
        renderPassEncoder.setBindGroup(0, this._alignToViewPort());
        renderPassEncoder.drawIndexed(6);

        renderPassEncoder.end();

        this._device.queue.submit([commandEncoder.finish()]);
    }

    private _createFilledRectanglePipeline(): GPURenderPipeline {
        const shaderModule = this._device.createShaderModule({
            label: "Filled rectangle shader",
            code: filledMonochromeShapeShader,
        });

        return this._device.createRenderPipeline({
            layout: this._device.createPipelineLayout({
                label: "Filled rectangle pipeline layout",
                bindGroupLayouts: [
                    this._viewPortBindGroupLayout,
                ],
            }),
            primitive: {
                topology: "triangle-list",
            },
            vertex: {
                module: shaderModule,
                entryPoint: "vs_main",
                buffers: [{
                    arrayStride: 6 * Float32Array.BYTES_PER_ELEMENT, // xyrgba
                    attributes: [
                        {
                            shaderLocation: 0,
                            format: "float32x2",
                            offset: 0,
                        },
                        {
                            shaderLocation: 1,
                            format: "float32x4",
                            offset: 2 * Float32Array.BYTES_PER_ELEMENT,
                        },
                    ],
                    stepMode: "vertex",
                }],
            },
            fragment: {
                module: shaderModule,
                entryPoint: "fs_main",
                targets: [{
                    format: navigator.gpu.getPreferredCanvasFormat(),
                }],
            },
        });
    }

    private _createRenderPassEncoder(
        commandEncoder: GPUCommandEncoder,
        clearValue: [number, number, number, number],
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
}
