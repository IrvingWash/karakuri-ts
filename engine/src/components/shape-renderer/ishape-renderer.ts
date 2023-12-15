import { IRenderer } from "../../core/renderer";
import { ITransform } from "../transform";

export interface IShapeRenderer {
    __init(renderer: IRenderer, transform: ITransform): void;
    drawFilledRectangle(): void;
}
