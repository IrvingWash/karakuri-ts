import { CanvasSize } from "../../canvas";
import { createBuffer } from "../renderer-uitls";
import { type IViewPort, ViewPort } from "../view-port";
import { IShapeRenderer } from "./ishape-renderer";
import { filledMonochromeShapeShader } from "./shaders/filled-monochrome-shape-shader.ts";

export class ShapeRenderer implements IShapeRenderer {
    private readonly _canvasSize: CanvasSize;
    private readonly _device: GPUDevice;
    private readonly _ctx: GPUCanvasContext;

    private readonly _viewPort: IViewPort;

    private readonly _quadIndexBuffer: GPUBuffer;

    private readonly _filledRectanglePipeline: GPURenderPipeline;

    public constructor(device: GPUDevice, ctx: GPUCanvasContext, canvasSize: CanvasSize) {
        this._device = device;
        this._ctx = ctx;
        this._canvasSize = canvasSize;

        this._viewPort = new ViewPort(this._canvasSize, this._device);

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
            // TODO: unuptimal spread operator here
            (x + halfWidth), (y + halfHeight), ...color, // top right
            (x + halfWidth), (y - halfHeight), ...color, // bottom right
            (x - halfWidth), (y - halfHeight), ...color, // bottom left
            (x - halfWidth), (y + halfHeight), ...color, // top left
        ];

        renderPassEncoder.setPipeline(this._filledRectanglePipeline);
        renderPassEncoder.setVertexBuffer(0, createBuffer(this._device, new Float32Array(vertexData), GPUBufferUsage.VERTEX));
        renderPassEncoder.setIndexBuffer(this._quadIndexBuffer, "uint16");
        renderPassEncoder.setBindGroup(0, this._viewPort.bindGroup);
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
                    this._viewPort.bindGroupLayout,
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
