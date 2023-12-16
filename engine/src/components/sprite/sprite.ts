import type { IAssetStorage } from "../../core/asset-storage";
import { RGBA } from "../../core/objects";
import { ISpriteRenderer, Texture } from "../../core/sprite-renderer";
import { ensureExists } from "../../utils/existence-ensurer";
import type { ITransform } from "../transform";
import type { ISprite } from "./isprite";

interface SpriteParams {
    path: string;
    color?: RGBA;
    antialias?: boolean;
}

export class Sprite implements ISprite {
    private readonly _path: string;
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
    }

    public async __init(spriteRenderer: ISpriteRenderer, transform: ITransform, assetStorage: IAssetStorage): Promise<void> {
        this._spriteRenderer = spriteRenderer;
        this._transform = transform;

        await assetStorage.addTexture(this._path, this._spriteRenderer.device, this._antialias);

        this._texture = ensureExists(assetStorage.getTexture(this._path));
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

    private _calculateVertices(x: number, y: number): number[] {
        this._previousX = x;
        this._previousY = y;

        const width = this._texture.texture.width * this._transform.scale.x;
        const height = this._texture.texture.height * this._transform.scale.y;

        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;

        return [
            (x + halfWidth), (y + halfHeight), 1, 1, ...this._color, // top right
            (x + halfWidth), (y - halfHeight), 1, 0, ...this._color, // bottom right
            (x - halfWidth), (y - halfHeight), 0, 0, ...this._color, // bottom left
            (x - halfWidth), (y + halfHeight), 0, 1, ...this._color, // top left
        ];
    }
}
