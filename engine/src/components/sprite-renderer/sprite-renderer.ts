import type { IAssetStorage } from "../../core/asset-storage";
import { RGBA } from "../../core/objects";
import { IRenderer, Texture } from "../../core/renderer";
import { ensureExists } from "../../utils/existence-ensurer";
import type { ITransform } from "../transform";
import type { ISpriteRenderer } from "./isprite-renderer";
import { spriteShader } from "./shaders/sprite-shader";

interface SpriteRendererParams {
    path: string;
    color?: RGBA;
    antialias?: boolean;
}

export class SpriteRenderer implements ISpriteRenderer {
    private readonly _path: string;
    private readonly _color: RGBA;
    private readonly _antialias: boolean;

    private _renderer!: IRenderer;
    private _transform!: ITransform;

    private _texture!: Texture;

    public constructor(params: SpriteRendererParams) {
        this._path = params.path;
        this._color = params.color ?? [1, 1, 1, 1];
        this._antialias = params.antialias ?? false;
    }

    public async __init(renderer: IRenderer, transform: ITransform, assetStorage: IAssetStorage): Promise<void> {
        this._renderer = renderer;
        this._transform = transform;

        await assetStorage.addTexture(this._path, this._renderer.device, this._antialias);

        this._texture = ensureExists(assetStorage.getTexture(this._path));
    }

    public draw(): void {
        const x = this._transform.position.x;
        const y = this._transform.position.y;
        const width = this._texture.texture.width * this._transform.scale.x;
        const height = this._texture.texture.height * this._transform.scale.y;

        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;

        const vertices = [
            (x + halfWidth), (y + halfHeight), 1, 1, ...this._color, // top right
            (x + halfWidth), (y - halfHeight), 1, 0, ...this._color, // bottom right
            (x - halfWidth), (y - halfHeight), 0, 0, ...this._color, // bottom left
            (x - halfWidth), (y + halfHeight), 0, 1, ...this._color, // top left
        ];

        this._renderer.queueDraw(
            vertices,
            this._texture,
            spriteShader,
        );
    }
}
