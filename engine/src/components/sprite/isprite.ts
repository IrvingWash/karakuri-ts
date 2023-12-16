import type { IAssetStorage } from "../../core/asset-storage";
import type { ISpriteRenderer } from "../../core/sprite-renderer";
import type { ITransform } from "../transform";

export interface ISprite {
    __init(spriteRenderer: ISpriteRenderer, transform: ITransform, assetStorage: IAssetStorage): Promise<void>;
    draw(): void;
}
