import type { IAssetStorage } from "../../core/asset-storage";
import type { IRenderer } from "../../core/renderer";
import type { ITransform } from "../transform";

export interface ISprite {
    __init(renderer: IRenderer, transform: ITransform, assetStorage: IAssetStorage): Promise<void>;
    draw(): void;
}
