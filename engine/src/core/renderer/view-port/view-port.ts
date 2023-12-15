import { Matrix4 } from "../../../math/matrix/matrix";
import { CanvasSize } from "../../canvas";
import { createBuffer } from "../renderer-uitls";
import { IViewPort } from "./ivew-port";

export class ViewPort implements IViewPort {
    public readonly bindGroupLayout: GPUBindGroupLayout;
    public readonly bindGroup: GPUBindGroup;

    public constructor(size: CanvasSize, device: GPUDevice) {
        const matrix = new Matrix4().orthogonalProjection(0, size.width, size.height, 0, -1, 1);

        const buffer = createBuffer(
            device,
            matrix.values,
            GPUBufferUsage.UNIFORM,
            "Viewport uniform buffer",
        );

        this.bindGroupLayout = device.createBindGroupLayout({
            label: "View port bind group layout",
            entries: [{
                binding: 0,
                visibility: GPUShaderStage.VERTEX,
                buffer: {
                    type: "uniform",
                },
            }],
        }),

        this.bindGroup = device.createBindGroup({
            label: "View port bind group",
            layout: this.bindGroupLayout,
            entries: [{
                binding: 0,
                resource: {
                    buffer,
                },
            }],
        });
    }
}
