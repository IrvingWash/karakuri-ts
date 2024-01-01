import { Canvas, type CanvasSize, type ICanvas } from "../../core/canvas";
import { type IInput, Input } from "../../core/input";
import { type ILooper, Looper } from "../../core/looper";
import { type RGBA } from "../../core/objects";
import { type ISpriteRenderer, SpriteRenderer, initializeGPU } from "../../core/sprite-renderer";
import { OrthogonalProjection } from "../../core/orthogonal-projection";
import { AssetStorage, type IAssetStorage } from "../../core/asset-storage";
import { type IScene, Scene } from "../scene";
import type { IKarakuri } from "./ikarakuri";
import type { EngineConfiguration } from "./karakuri-objects";
import { PhysicsAffector, type IPhysicsAffector } from "../physics-affector";

export class Karakuri implements IKarakuri {
    private readonly _canvas: ICanvas;
    private readonly _looper: ILooper;
    private readonly _input: IInput;
    private readonly _physicsAffector: IPhysicsAffector;
    private _assetStorage!: IAssetStorage;
    private _spriteRenderer!: ISpriteRenderer;

    private readonly _clearColor: RGBA;

    private _isInitialized: boolean = false;

    public constructor(params?: EngineConfiguration) {
        this._canvas = new Canvas(params?.canvasSize);
        this._looper = new Looper();
        this._input = new Input();
        this._physicsAffector = new PhysicsAffector();

        this._clearColor = params?.clearColor ?? [1, 1, 1, 1];
    }

    public async init(): Promise<void> {
        const [device, ctx] = await initializeGPU(this._canvas.getContextGpu());
        const orthogonalProjection = new OrthogonalProjection(this._canvas.getSize());

        this._spriteRenderer = new SpriteRenderer(device, ctx, orthogonalProjection, this._clearColor);
        this._assetStorage = new AssetStorage(device);

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
            spriteRenderer: this._spriteRenderer,
            looper: this._looper,
            assetStorage: this._assetStorage,
            physicsAffector: this._physicsAffector,
        });
    }
}
