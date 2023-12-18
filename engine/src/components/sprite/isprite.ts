import type { IAssetStorage } from "../../core/asset-storage";
import { DrawData } from "../../core/sprite-renderer";
import type { ITransform } from "../transform";

export interface ISprite {
    __init(transform: ITransform, assetStorage: IAssetStorage): Promise<void>;
    getDrawData(): DrawData;
}
