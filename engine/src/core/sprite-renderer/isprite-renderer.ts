import { ISprite } from "./sprite-renderer-objects";

export interface ISpriteRenderer {
    beginDrawing(): void;
    finishDrawing(): void;
    queueDraw(sprite: ISprite, vertices: number[]): void;
}
