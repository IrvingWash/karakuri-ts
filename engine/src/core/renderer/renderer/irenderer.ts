import { Texture } from "../renderer-objects";

export interface IRenderer {
    readonly device: GPUDevice;
    readonly viewPortBindGroupLayout: GPUBindGroupLayout;

    beginDrawing(): void;
    finishDrawing(): void;
    queueDraw(vertices: number[], texture: Texture, shader: string): void;

    createBuffer(
        data: Float32Array | Uint16Array,
        type: GPUFlagsConstant,
        label?: string,
    ): GPUBuffer;
}
