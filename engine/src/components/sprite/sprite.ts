import type { IAssetStorage } from "../../core/asset-storage";
import { RGBA } from "../../core/objects";
import { Texture, DrawData } from "../../core/sprite-renderer";
import { ensureExists } from "../../utils/existence-ensurer";
import type { ITransform } from "../transform";
import type { ISprite } from "./isprite";
import type { Clip } from "./sprite-objects";

interface SpriteParams {
    path: string;
    clip?: Clip;
    color?: RGBA;
    antialias?: boolean;
}

export class Sprite implements ISprite {
    private readonly _path: string;
    private _clip: Clip | null = null; // TODO: this typing sucks because there is always a clip after sprite initialization
    private readonly _color: RGBA;
    private readonly _antialias: boolean;

    private _transform!: ITransform;

    private _texture!: Texture;

    public constructor(params: SpriteParams) {
        this._path = params.path;
        this._color = params.color ?? [1, 1, 1, 1];
        this._antialias = params.antialias ?? false;

        if (params.clip !== undefined) {
            this._clip = params.clip;
        }
    }

    public async __init(transform: ITransform, assetStorage: IAssetStorage): Promise<void> {
        this._transform = transform;

        await assetStorage.addTexture(this._path, this._antialias);

        this._texture = ensureExists(assetStorage.getTexture(this._path));

        this._clip ??= {
            x: 0,
            y: 0,
            width: this._texture.texture.width,
            height: this._texture.texture.height,
        };
    }

    public getDrawData(): DrawData {
        return {
            vertices: this._calculateVertices(),
            texture: this._texture,
        };
    }

    // TODO: consider delegating some of these calculations to GPU
    private _calculateVertices(): number[] {
        if (this._clip === null) {
            throw new Error("Clip is not initialized");
        }

        const u0 = this._clip.x / this._texture.texture.width;
        const v0 = this._clip.y / this._texture.texture.height;
        const u1 = (this._clip.x + this._clip.width) / this._texture.texture.width;
        const v1 = (this._clip.y + this._clip.height) / this._texture.texture.height;

        const width = this._clip.width * this._transform.scale.x;
        const height = this._clip.height * this._transform.scale.y;

        const { x, y } = this._transform.position;

        return [
            x + width, y + height, u1, v1, ...this._color, // bottom right
            x + width, y, u1, v0, ...this._color, // top right
            x, y, u0, v0, ...this._color, // top left
            x, y + height, u0, v1, ...this._color, // bottom left
        ];
    }
}
