import { Canvas, type ICanvas } from "../../core/canvas";
import { type IInput, Input } from "../../core/input";
import { type ILooper, Looper } from "../../core/looper";
import { type IRenderer, Renderer, initializeGPU } from "../../core/renderer";
import { ViewPort } from "../../core/renderer/view-port";
import { type IScene, Scene } from "../scene";
import type { IKarakuri } from "./ikarakuri";
import { EngineConfiguration } from "./karakuri-objects";

export class Karakuri implements IKarakuri {
    private readonly _canvas: ICanvas;
    private readonly _looper: ILooper;
    private readonly _input: IInput;
    private _renderer!: IRenderer;

    private _isInitialized: boolean = false;

    public constructor(params?: EngineConfiguration) {
        this._canvas = new Canvas(params?.canvasSize);
        this._looper = new Looper();
        this._input = new Input();
    }

    public async init(): Promise<void> {
        const [device, ctx] = await initializeGPU(this._canvas.getContextGpu());
        const viewPort = new ViewPort(this._canvas.getSize());

        this._renderer = new Renderer(device, ctx, viewPort);

        this._isInitialized = true;
    }

    public createScene(): IScene {
        if (!this._isInitialized) {
            throw new Error("Karakuri must be initialized before usage");
        }

        return new Scene({
            input: this._input,
            renderer: this._renderer,
            looper: this._looper,
        });
    }
}
