import { IRenderer } from "../../core/renderer";

export interface IShapeRenderer {
    __init(renderer: IRenderer): void;

    drawFilledRectangle(
        x: number, y: number,
        width: number, height: number,
        color: [number, number, number, number],
    ): void;
}
