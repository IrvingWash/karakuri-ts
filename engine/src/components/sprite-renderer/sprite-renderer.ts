import { RGBA } from "../../core/objects";
import { IRenderer, Texture } from "../../core/renderer";
import { ITransform } from "../transform";
import { ISpriteRenderer } from "./isprite-renderer";
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
    private _sampler!: GPUSampler;

    public constructor(params: SpriteRendererParams) {
        this._path = params.path;
        this._color = params.color ?? [1, 1, 1, 1];
        this._antialias = params.antialias ?? false;
    }

    public async __init(renderer: IRenderer, transform: ITransform): Promise<void> {
        this._renderer = renderer;
        this._transform = transform;

        await this._createTextureAndSampler();
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

    private async _createTextureAndSampler(): Promise<void> {
        const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.src = this._path;

            image.onload = (): void => resolve(image);
            image.onerror = (): void => reject(`Failed to load image ${this._path}`);
        });

        const image = await imageLoadPromise;

        const filterMode: GPUFilterMode = this._antialias ? "linear" : "nearest";
        this._sampler = this._renderer.device.createSampler({
            magFilter: filterMode,
            minFilter: filterMode,
        });

        this._texture = {
            id: image.src,
            texture: this._renderer.device.createTexture({
                size: { width: image.width, height: image.height },
                format: navigator.gpu.getPreferredCanvasFormat(),
                usage: GPUTextureUsage.COPY_DST
                    | GPUTextureUsage.TEXTURE_BINDING
                    | GPUTextureUsage.RENDER_ATTACHMENT,
            }),
            sampler: this._sampler,
        };

        const data = await createImageBitmap(image);

        this._renderer.device.queue.copyExternalImageToTexture(
            { source: data },
            { texture: this._texture.texture },
            { width: image.width, height: image.height },
        );
    }
}
