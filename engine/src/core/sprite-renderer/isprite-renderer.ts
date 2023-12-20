import { ISprite } from "./sprite-renderer-objects";

export interface ISpriteRenderer {
    readonly device: GPUDevice;

    beginDrawing(): void;
    finishDrawing(): void;
    queueDraw(sprite: ISprite, vertices: number[]): void;
}
