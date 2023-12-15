import { RGBA } from "../../core/objects";
import { IRenderer } from "../../core/renderer";
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

    private _texture!: GPUTexture;
    private _sampler!: GPUSampler;
    private _textureBindGroup!: GPUBindGroup;
    private _pipeline!: GPURenderPipeline;
    private _quadIndexBuffer!: GPUBuffer;

    public constructor(params: SpriteRendererParams) {
        this._path = params.path;
        this._color = params.color ?? [1, 1, 1, 1];
        this._antialias = params.antialias ?? false;
    }

    public async __init(renderer: IRenderer, transform: ITransform): Promise<void> {
        this._renderer = renderer;
        this._transform = transform;

        this._createQuadIndexBuffer();
        await this._createTextureAndSampler();
        this._createPipeline();
    }

    public draw(): void {
        const x = this._transform.position.x;
        const y = this._transform.position.y;
        const width = this._texture.width * this._transform.scale.x;
        const height = this._texture.height * this._transform.scale.y;

        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;

        const vertices = [
            (x + halfWidth), (y + halfHeight), 1, 1, ...this._color, // top right
            (x + halfWidth), (y - halfHeight), 1, 0, ...this._color, // bottom right
            (x - halfWidth), (y - halfHeight), 0, 0, ...this._color, // bottom left
            (x - halfWidth), (y + halfHeight), 0, 1, ...this._color, // top left
        ];

        this._renderer.queueDraw(
            this._pipeline,
            vertices,
            this._quadIndexBuffer,
            [this._textureBindGroup],
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

        this._texture = this._renderer.device.createTexture({
            size: { width: image.width, height: image.height },
            format: navigator.gpu.getPreferredCanvasFormat(),
            usage: GPUTextureUsage.COPY_DST
                | GPUTextureUsage.TEXTURE_BINDING
                | GPUTextureUsage.RENDER_ATTACHMENT,
        });

        const data = await createImageBitmap(image);

        this._renderer.device.queue.copyExternalImageToTexture(
            { source: data },
            { texture: this._texture },
            { width: image.width, height: image.height },
        );

        const filterMode: GPUFilterMode = this._antialias ? "linear" : "nearest";

        this._sampler = this._renderer.device.createSampler({
            magFilter: filterMode,
            minFilter: filterMode,
        });
    }

    private _createPipeline(): void {
        const shaderModule = this._renderer.device.createShaderModule({
            label: "Sprite shader module",
            code: spriteShader,
        });

        const vertexBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 8 * Float32Array.BYTES_PER_ELEMENT,
            attributes: [
                {
                    shaderLocation: 0,
                    offset: 0,
                    format: "float32x2",
                },
                {
                    shaderLocation: 1,
                    offset: 2 * Float32Array.BYTES_PER_ELEMENT,
                    format: "float32x2",
                },
                {
                    shaderLocation: 2,
                    offset: 4 * Float32Array.BYTES_PER_ELEMENT,
                    format: "float32x4",
                },
            ],
            stepMode: "vertex",
        };

        const textureBindGroupLayout = this._renderer.device.createBindGroupLayout({
            entries: [
                {
                    binding: 0,
                    visibility: GPUShaderStage.FRAGMENT,
                    sampler: {},
                },
                {
                    binding: 1,
                    visibility: GPUShaderStage.FRAGMENT,
                    texture: {},
                },
            ],
        });

        this._textureBindGroup = this._renderer.device.createBindGroup({
            layout: textureBindGroupLayout,
            entries: [
                {
                    binding: 0,
                    resource: this._sampler,
                },
                {
                    binding: 1,
                    resource: this._texture.createView(),
                },
            ],
        });

        this._pipeline = this._renderer.device.createRenderPipeline({
            label: "Sprite render pipeline",
            layout: this._renderer.device.createPipelineLayout({
                bindGroupLayouts: [
                    this._renderer.viewPortBindGroupLayout,
                    textureBindGroupLayout,
                ],
            }),
            primitive: {
                topology: "triangle-list",
            },
            vertex: {
                module: shaderModule,
                entryPoint: "vs_main",
                buffers: [vertexBufferLayout],
            },
            fragment: {
                module: shaderModule,
                entryPoint: "fs_main",
                targets: [{
                    format: navigator.gpu.getPreferredCanvasFormat(),
                    blend: {
                        color: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add",
                        },
                        alpha: {
                            srcFactor: "one",
                            dstFactor: "one-minus-src-alpha",
                            operation: "add",
                        },
                    },
                }],
            },
        });
    }

    // TODO: this code is duplicated
    private _createQuadIndexBuffer(): void {
        this._quadIndexBuffer = this._renderer.createBuffer(
            new Uint16Array([
                0, 1, 2,
                2, 3, 0,
            ]),
            GPUBufferUsage.INDEX,
        );
    }
}
