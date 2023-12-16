import { Texture } from "./sprite-renderer-objects";

export interface ISpriteRenderer {
    readonly device: GPUDevice;

    beginDrawing(): void;
    finishDrawing(): void;
    queueDraw(vertices: number[], texture: Texture): void;
}
