import { DrawData } from "./sprite-renderer-objects";

export interface ISpriteRenderer {
    readonly device: GPUDevice;

    beginDrawing(): void;
    finishDrawing(): void;
    queueDraw(drawData: DrawData): void;
}
