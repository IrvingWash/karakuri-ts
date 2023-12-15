import { type IViewPort } from "../view-port";
import { IRenderer } from "./irenderer";

export class Renderer implements IRenderer {
    public readonly device: GPUDevice;
    public readonly viewPortBindGroupLayout: GPUBindGroupLayout;

    private readonly _ctx: GPUCanvasContext;
    private readonly _viewPort: IViewPort;

    public constructor(device: GPUDevice, ctx: GPUCanvasContext, viewPort: IViewPort) {
        this.device = device;
        this._ctx = ctx;
        this._viewPort = viewPort;

        this.viewPortBindGroupLayout = this.device.createBindGroupLayout({
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

    public draw(pipeline: GPURenderPipeline, vertices: number[], indexBuffer: GPUBuffer): void {
        const commandEncoder = this.device.createCommandEncoder({
            label: "Filled rectangle drawing command encoder",
        });

        const renderPassEncoder = this._createRenderPassEncoder(commandEncoder, [1, 1, 1, 1]);

        renderPassEncoder.setPipeline(pipeline);

        renderPassEncoder.setVertexBuffer(
            0,
            this.createBuffer(new Float32Array(vertices), GPUBufferUsage.VERTEX),
        );

        renderPassEncoder.setIndexBuffer(indexBuffer, "uint16");
        renderPassEncoder.setBindGroup(0, this._alignToViewPort());
        renderPassEncoder.drawIndexed(6);

        renderPassEncoder.end();

        this.device.queue.submit([commandEncoder.finish()]);
    }

    public createBuffer(
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
        const buffer = this.createBuffer(
            this._viewPort.projectionMatrix.values,
            GPUBufferUsage.UNIFORM,
            "Viewport uniform buffer",
        );

        return this.device.createBindGroup({
            label: "View port bind group",
            layout: this.viewPortBindGroupLayout,
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
