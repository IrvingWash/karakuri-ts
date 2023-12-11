import { Canvas, ICanvas } from "../../core/canvas";
import { IInput, Input } from "../../core/input";
import { ILooper, Looper } from "../../core/looper";
import { IRenderer, Renderer } from "../../core/renderer";
import { IScene, Scene } from "../scene";
import { IKarakuri } from "./ikarakuri";
import { EngineConfiguration } from "./karakuri-objects";

export class Karakuri implements IKarakuri {
    private readonly _canvas: ICanvas;
    private readonly _looper: ILooper;
    private readonly _input: IInput;
    private readonly _renderer: IRenderer;

    private _isInitialized: boolean = false;

    public constructor(params?: EngineConfiguration) {
        this._canvas = new Canvas(params?.canvasSize);
        this._looper = new Looper();
        this._input = new Input();

        this._renderer = new Renderer(
            this._canvas.getSize(),
            this._canvas.getContextGpu(),
        );
    }

    public async init(): Promise<void> {
        await this._renderer.init();

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
