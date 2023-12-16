import { RGBA } from "../../objects";
import { type IViewPort } from "../view-port";
import { IRenderer } from "./irenderer";

// const MAX_SPRITE_COUNT_PER_BUFFER = 1000;
// const INDICES_PER_SPRITE = 6;
// const ATTRIBUTES_PER_VERTEX = 8;
// const ATTRIBUTES_PER_SPRITE = ATTRIBUTES_PER_VERTEX * 4;

export class Renderer implements IRenderer {
    public readonly device: GPUDevice;
    public readonly viewPortBindGroupLayout: GPUBindGroupLayout;

    private readonly _ctx: GPUCanvasContext;
    private readonly _viewPort: IViewPort;
    private readonly _clearColor: RGBA;

    private _commandEncoder: GPUCommandEncoder | null = null;
    private _renderPassEncoder: GPURenderPassEncoder | null = null;

    public constructor(device: GPUDevice, ctx: GPUCanvasContext, viewPort: IViewPort, clearColor: RGBA) {
        this.device = device;
        this._ctx = ctx;
        this._viewPort = viewPort;
        this._clearColor = clearColor;

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

    public queueDraw(pipeline: GPURenderPipeline, vertices: number[], indexBuffer: GPUBuffer, bindGroups: GPUBindGroup[] = []): void {
        if (this._renderPassEncoder === null || this._commandEncoder === null) {
            return;
        }

        this._renderPassEncoder.setPipeline(pipeline);

        this._renderPassEncoder.setVertexBuffer(
            0,
            this.createBuffer(new Float32Array(vertices), GPUBufferUsage.VERTEX),
        );

        this._renderPassEncoder.setIndexBuffer(indexBuffer, "uint16");

        this._renderPassEncoder.setBindGroup(0, this._alignToViewPort());

        for (const [id, bindGroup] of bindGroups.entries()) {
            this._renderPassEncoder.setBindGroup(id + 1, bindGroup);
        }

        this._renderPassEncoder.drawIndexed(6);
    }

    public beginDrawing(): void {
        this._commandEncoder = this.device.createCommandEncoder({
            label: "Filled rectangle drawing command encoder",
        });

        this._renderPassEncoder = this._createRenderPassEncoder(this._commandEncoder, this._clearColor);
    }

    public finishDrawing(): void {
        if (this._commandEncoder === null || this._renderPassEncoder === null) {
            return;
        }

        this._renderPassEncoder.end();

        this.device.queue.submit([this._commandEncoder.finish()]);
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
}
