import type { IRenderer } from "../../core/renderer";
import type { ITransform } from "../transform";

export interface ISpriteRenderer {
    __init(renderer: IRenderer, transform: ITransform): Promise<void>;
    draw(): void;
}
