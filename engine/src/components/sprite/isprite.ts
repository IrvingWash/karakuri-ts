import type { IAssetStorage } from "../../core/asset-storage";
import type { RGBA } from "../../core/objects";
import type { Clip, Texture } from "../../core/sprite-renderer";

export interface ISprite {
    readonly color: RGBA;
    readonly clip: Clip;
    readonly texture: Texture;

    __init(assetStorage: IAssetStorage): Promise<void>;
}
