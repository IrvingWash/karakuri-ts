import type { IAssetStorage } from "../../core/asset-storage";
import { RGBA } from "../../core/objects";
import { ISpriteRenderer, Texture } from "../../core/sprite-renderer";
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

    private _spriteRenderer!: ISpriteRenderer;
    private _transform!: ITransform;

    private _texture!: Texture;

    private _vertices: number[] | null = null;
    private _previousX: number | null = null;
    private _previousY: number | null = null;

    public constructor(params: SpriteParams) {
        this._path = params.path;
        this._color = params.color ?? [1, 1, 1, 1];
        this._antialias = params.antialias ?? false;

        if (params.clip !== undefined) {
            this._clip = params.clip;
        }
    }

    public async __init(spriteRenderer: ISpriteRenderer, transform: ITransform, assetStorage: IAssetStorage): Promise<void> {
        this._spriteRenderer = spriteRenderer;
        this._transform = transform;

        await assetStorage.addTexture(this._path, this._spriteRenderer.device, this._antialias);

        this._texture = ensureExists(assetStorage.getTexture(this._path));

        this._clip ??= {
            x: 0,
            y: 0,
            width: this._texture.texture.width,
            height: this._texture.texture.height,
        };
    }

    public draw(): void {
        const x = this._transform.position.x;
        const y = this._transform.position.y;

        if (this._vertices === null || (x !== this._previousX || y !== this._previousY)) {
            this._vertices = this._calculateVertices(x, y);
        }

        this._spriteRenderer.queueDraw(
            this._vertices,
            this._texture,
        );
    }

    // TODO: consider delegating some of these calculations to GPU
    private _calculateVertices(x: number, y: number): number[] {
        if (this._clip === null) {
            throw new Error("Clip is not initialized");
        }

        this._previousX = x;
        this._previousY = y;

        const width = this._texture.texture.width * this._transform.scale.x;
        const height = this._texture.texture.height * this._transform.scale.y;

        const u0 = this._clip.x / width;
        const v0 = this._clip.y / height;
        const u1 = (this._clip.x + this._clip.width) / width;
        const v1 = (this._clip.y + this._clip.height) / height;

        const halfWidth = this._clip.width * 0.5;
        const halfHeight = this._clip.width * 0.5;

        return [
            (x + halfWidth), (y + halfHeight), u1, v1, ...this._color, // top right
            (x + halfWidth), (y - halfHeight), u1, v0, ...this._color, // bottom right
            (x - halfWidth), (y - halfHeight), u0, v0, ...this._color, // bottom left
            (x - halfWidth), (y + halfHeight), u0, v1, ...this._color, // top left
        ];
    }
}
