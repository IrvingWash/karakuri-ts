import { Canvas, type ICanvas } from "../../core/canvas";
import { type IInput, Input } from "../../core/input";
import { type ILooper, Looper } from "../../core/looper";
import { type IShapeRenderer, ShapeRenderer, initializeGPU } from "../../core/renderer";
import { type IScene, Scene } from "../scene";
import type { IKarakuri } from "./ikarakuri";
import { EngineConfiguration } from "./karakuri-objects";

export class Karakuri implements IKarakuri {
    private readonly _canvas: ICanvas;
    private readonly _looper: ILooper;
    private readonly _input: IInput;
    private _shapeRenderer!: IShapeRenderer;

    private _isInitialized: boolean = false;

    public constructor(params?: EngineConfiguration) {
        this._canvas = new Canvas(params?.canvasSize);
        this._looper = new Looper();
        this._input = new Input();
    }

    public async init(): Promise<void> {
        const [device, ctx] = await initializeGPU(this._canvas.getContextGpu());

        this._shapeRenderer = new ShapeRenderer(device, ctx, this._canvas.getSize());

        this._isInitialized = true;
    }

    public createScene(): IScene {
        if (!this._isInitialized) {
            throw new Error("Karakuri must be initialized before usage");
        }

        return new Scene({
            input: this._input,
            shapeRenderer: this._shapeRenderer,
            looper: this._looper,
        });
    }
}
