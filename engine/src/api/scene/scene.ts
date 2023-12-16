import type { IAssetStorage } from "../../core/asset-storage";
import type { IInput } from "../../core/input";
import type { ILooper } from "../../core/looper";
import type { IRenderer } from "../../core/renderer";
import { Entity, type IEntity, type EntityParams } from "../entity";
import type { IScene } from "./iscene";

interface SceneParams {
    input: IInput;
    looper: ILooper;
    renderer: IRenderer;
    assetStorage: IAssetStorage;
}

export class Scene implements IScene {
    private readonly _input: IInput;
    private readonly _looper: ILooper;
    private readonly _renderer: IRenderer;
    private readonly _assetStorage: IAssetStorage;

    private readonly _entities: IEntity[] = [];

    public constructor(params: SceneParams) {
        const {
            input,
            looper,
            renderer,
            assetStorage,
        } = params;

        this._input = input;
        this._looper = looper;
        this._renderer = renderer;
        this._assetStorage = assetStorage;
    }

    public async createEntity(params: EntityParams): Promise<IEntity> {
        const entity: IEntity = new Entity(params);

        await entity.__init(this._input, this._assetStorage, this._renderer);
        entity.start();

        this._entities.push(entity);

        return entity;
    }

    public removeEntity(entityToRemove: IEntity): void {
        entityToRemove.destroy();

        this._entities.splice(this._entities.indexOf(entityToRemove), 1);
    }

    public start(): void {
        this._looper.start((deltaTime) => {
            for (const entity of this._entities) {
                entity.update(deltaTime);
            }

            this._renderer.beginDrawing();
            for (const entity of this._entities) {
                entity.spriteRenderer?.draw();
            }
            this._renderer.finishDrawing();
        });
    }

    public pause(): void {
        this._looper.pause();
    }
}
