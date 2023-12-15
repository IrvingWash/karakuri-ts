export interface IRenderer {
    readonly device: GPUDevice;
    readonly viewPortBindGroupLayout: GPUBindGroupLayout;

    beginDrawing(): void;
    finishDrawing(): void;
    queueDraw(pipeline: GPURenderPipeline, vertices: number[], indexBuffer: GPUBuffer): void;

    createBuffer(
        data: Float32Array | Uint16Array,
        type: GPUFlagsConstant,
        label?: string,
    ): GPUBuffer;
}
