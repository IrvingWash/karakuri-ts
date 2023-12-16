import { Canvas, type CanvasSize, type ICanvas } from "../../core/canvas";
import { type IInput, Input } from "../../core/input";
import { type ILooper, Looper } from "../../core/looper";
import { type RGBA } from "../../core/objects";
import { type IRenderer, Renderer, initializeGPU } from "../../core/renderer";
import { ViewPort } from "../../core/renderer/view-port";
import { AssetStorage, type IAssetStorage } from "../../core/asset-storage";
import { type IScene, Scene } from "../scene";
import type { IKarakuri } from "./ikarakuri";
import { EngineConfiguration } from "./karakuri-objects";

export class Karakuri implements IKarakuri {
    private readonly _canvas: ICanvas;
    private readonly _looper: ILooper;
    private readonly _input: IInput;
    private readonly _assetStorage: IAssetStorage;
    private _renderer!: IRenderer;

    private readonly _clearColor: RGBA;

    private _isInitialized: boolean = false;

    public constructor(params?: EngineConfiguration) {
        this._canvas = new Canvas(params?.canvasSize);
        this._looper = new Looper();
        this._input = new Input();
        this._assetStorage = new AssetStorage();

        this._clearColor = params?.clearColor ?? [1, 1, 1, 1];
    }

    public async init(): Promise<void> {
        const [device, ctx] = await initializeGPU(this._canvas.getContextGpu());
        const viewPort = new ViewPort(this._canvas.getSize());

        this._renderer = new Renderer(device, ctx, viewPort, this._clearColor);

        this._isInitialized = true;
    }

    public getCanvasSize(): CanvasSize {
        return this._canvas.getSize();
    }

    public createScene(): IScene {
        if (!this._isInitialized) {
            throw new Error("Karakuri must be initialized before usage");
        }

        return new Scene({
            input: this._input,
            renderer: this._renderer,
            looper: this._looper,
            assetStorage: this._assetStorage,
        });
    }
}
