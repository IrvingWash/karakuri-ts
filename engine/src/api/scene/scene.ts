import { Canvas, type ICanvas } from "../../core/canvas";
import { Looper, type ILooper } from "../../core/looper";
import { Input, type IInput } from "../../core/input";
import { SceneSize } from "./scene-objects";
import { Entity } from "../entity/entity";
import type { IScene } from "./iscene";
import type { IEntity } from "../entity/ientity";
import type { EntityParams } from "../entity";

export class Scene implements IScene {
    private _canvas: ICanvas;
    private _looper: ILooper;
    private _input: IInput;

    private _entities: IEntity[] = [];

    public constructor(size?: SceneSize) {
        this._canvas = new Canvas(size);
        this._looper = new Looper();
        this._input = new Input();
    }

    public createEntity(params: EntityParams): IEntity {
        const entity = new Entity(params);

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
        });
    }

    public pause(): void {
        this._looper.pause();
    }

    public getSize(): SceneSize {
        return this._canvas.getSize();
    }
}
