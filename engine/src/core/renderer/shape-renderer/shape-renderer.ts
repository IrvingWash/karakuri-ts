import { CanvasSize } from "../../canvas";
import { IShapeRenderer } from "./ishape-renderer";
import { filledRectangleShader } from "./shaders/filled-rectangle-shader";

export class ShapeRenderer implements IShapeRenderer {
    private readonly _canvasSize: CanvasSize;
    private _device: GPUDevice;
    private _ctx: GPUCanvasContext;

    private _quadIndexBuffer: GPUBuffer;

    private _filledRectanglePipeline: GPURenderPipeline;

    public constructor(device: GPUDevice, ctx: GPUCanvasContext, canvasSize: CanvasSize) {
        this._device = device;
        this._ctx = ctx;
        this._canvasSize = canvasSize;

        this._quadIndexBuffer = this._createBuffer(
            new Uint16Array([
                0, 1, 2,
                2, 3, 0,
            ]),
            GPUBufferUsage.INDEX,
        );

        this._filledRectanglePipeline = this._createFilledRectanglePipeline();

        console.log(this._canvasSize);
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
            (x + halfWidth), (y + halfHeight), ...color, // top right
            (x + halfWidth), (y - halfHeight), ...color, // bottom right
            (x - halfWidth), (y - halfHeight), ...color, // bottom left
            (x - halfWidth), (y + halfHeight), ...color, // top left
        ];

        renderPassEncoder.setPipeline(this._filledRectanglePipeline);
        renderPassEncoder.setVertexBuffer(0, this._createBuffer(new Float32Array(vertexData), GPUBufferUsage.VERTEX));
        renderPassEncoder.setIndexBuffer(this._quadIndexBuffer, "uint16");
        renderPassEncoder.drawIndexed(6);

        renderPassEncoder.end();

        this._device.queue.submit([commandEncoder.finish()]);
    }

    private _createFilledRectanglePipeline(): GPURenderPipeline {
        const shaderModule = this._device.createShaderModule({
            label: "Filled Rectangle Shader",
            code: filledRectangleShader,
        });

        return this._device.createRenderPipeline({
            layout: "auto",
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

    private _createBuffer(data: Float32Array | Uint16Array, type: GPUFlagsConstant, label?: string): GPUBuffer {
        const buffer = this._device.createBuffer({
            size: data.byteLength,
            label,
            usage: type | GPUBufferUsage.COPY_DST,
        });

        this._device.queue.writeBuffer(buffer, 0, data);

        return buffer;
    }
}
