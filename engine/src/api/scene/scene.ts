import { IInput } from "../../core/input";
import { ILooper } from "../../core/looper";
import { IRenderer } from "../../core/renderer";
import { Entity, type IEntity, type EntityParams } from "../entity";
import type { IScene } from "./iscene";

interface SceneParams {
    input: IInput;
    looper: ILooper;
    renderer: IRenderer;
}

export class Scene implements IScene {
    private _input: IInput;
    private _looper: ILooper;
    private _renderer: IRenderer;

    private _entities: IEntity[] = [];

    public constructor(params: SceneParams) {
        const {
            input,
            looper,
            renderer,
        } = params;

        this._input = input;
        this._looper = looper;
        this._renderer = renderer;
    }

    public createEntity(params: EntityParams): IEntity {
        const entity: IEntity = new Entity(params);

        entity.__init(this._input);
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

            this._renderer.test();
        });
    }

    public pause(): void {
        this._looper.pause();
    }
}
