import { type IRenderer } from "../../core/renderer";
import { ITransform } from "../transform";
import { type IShapeRenderer } from "./ishape-renderer";
import { filledMonochromeShapeShader } from "./shaders/filled-monochrome-shape-shader.ts";

export class ShapeRenderer implements IShapeRenderer {
    private _color: [number, number, number, number];
    private _transform!: ITransform;
    private _renderer!: IRenderer;

    private _filledRectanglePipeline: GPURenderPipeline | null = null;
    private _quadIndexBuffer: GPUBuffer | null = null;

    public constructor(color: [number, number, number, number]) {
        this._color = color;
    }

    public __init(renderer: IRenderer, transform: ITransform): void {
        this._renderer = renderer;
        this._transform = transform;
    }

    public drawFilledRectangle(): void {
        if (this._filledRectanglePipeline === null) {
            this._filledRectanglePipeline = this._createFilledRectangleRenderPipeline();
        }

        if (this._quadIndexBuffer === null) {
            this._quadIndexBuffer = this._renderer.createBuffer(
                new Uint16Array([
                    0, 1, 2,
                    2, 3, 0,
                ]),
                GPUBufferUsage.INDEX,
            );
        }

        const x = this._transform.position.x;
        const y = this._transform.position.y;
        const width = this._transform.scale.x;
        const height = this._transform.scale.y;

        const halfWidth = width * 0.5;
        const halfHeight = height * 0.5;

        const vertices = [
            // TODO: unoptimal spread operator here
            (x + halfWidth), (y + halfHeight), ...this._color, // top right
            (x + halfWidth), (y - halfHeight), ...this._color, // bottom right
            (x - halfWidth), (y - halfHeight), ...this._color, // bottom left
            (x - halfWidth), (y + halfHeight), ...this._color, // top left
        ];

        this._renderer.draw(this._filledRectanglePipeline, vertices, this._quadIndexBuffer);
    }

    private _createFilledRectangleRenderPipeline(): GPURenderPipeline {
        const shaderModule = this._renderer.device.createShaderModule({
            label: "Filled rectangle shader",
            code: filledMonochromeShapeShader,
        });

        return this._renderer.device.createRenderPipeline({
            layout: this._renderer.device.createPipelineLayout({
                label: "Filled rectangle pipeline layout",
                bindGroupLayouts: [
                    this._renderer.viewPortBindGroupLayout,
                ],
            }),
            primitive: {
                topology: "triangle-list",
            },
            vertex: {
                module: shaderModule,
                entryPoint: "vs_main",
                buffers: [{
                    arrayStride: 6 * Float32Array.BYTES_PER_ELEMENT, // xyrgba
                    attributes: [
                        {
                            shaderLocation: 0,
                            format: "float32x2",
                            offset: 0,
                        },
                        {
                            shaderLocation: 1,
                            format: "float32x4",
                            offset: 2 * Float32Array.BYTES_PER_ELEMENT,
                        },
                    ],
                    stepMode: "vertex",
                }],
            },
            fragment: {
                module: shaderModule,
                entryPoint: "fs_main",
                targets: [{
                    format: navigator.gpu.getPreferredCanvasFormat(),
                }],
            },
        });
    }
}
