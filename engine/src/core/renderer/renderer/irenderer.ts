import { Texture } from "../renderer-objects";

export interface IRenderer {
    readonly device: GPUDevice;

    beginDrawing(): void;
    finishDrawing(): void;
    queueDraw(vertices: number[], texture: Texture, shader: string): void;
}
