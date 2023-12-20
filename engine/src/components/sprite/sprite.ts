import type { IAssetStorage } from "../../core/asset-storage";
import { RGBA } from "../../core/objects";
import { Texture } from "../../core/sprite-renderer";
import { Clip } from "../../core/sprite-renderer";
import { ensureExists } from "../../utils/existence-ensurer";
import type { ISprite } from "./isprite";

interface SpriteParams {
    path: string;
    clip?: Clip;
    color?: RGBA;
    antialias?: boolean;
}

export class Sprite implements ISprite {
    public clip!: Clip;
    public color: RGBA;
    public texture!: Texture;

    private readonly _path: string;
    private readonly _antialias: boolean;

    public constructor(params: SpriteParams) {
        this.color = params.color ?? [1, 1, 1, 1];

        this._path = params.path;
        this._antialias = params.antialias ?? false;

        if (params.clip !== undefined) {
            this.clip = params.clip;
        }
    }

    public async __init(assetStorage: IAssetStorage): Promise<void> {
        await assetStorage.addTexture(this._path, this._antialias);

        this.texture = ensureExists(assetStorage.getTexture(this._path));

        this.clip ??= {
            x: 0,
            y: 0,
            width: this.texture.texture.width,
            height: this.texture.texture.height,
        };
    }
}
