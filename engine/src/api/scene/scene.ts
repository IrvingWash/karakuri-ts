import { Canvas, type ICanvas } from "../../core/canvas";
import { Looper, type ILooper } from "../../core/looper";
import { Input, type IInput } from "../../core/input";
import { Renderer, type IRenderer } from "../../core/renderer";
import { Entity, type IEntity, type EntityParams } from "../entity";
import { SceneSize } from "./scene-objects";
import type { IScene } from "./iscene";

export class Scene implements IScene {
    private _canvas: ICanvas;
    private _looper: ILooper;
    private _input: IInput;
    private _renderer: IRenderer;

    private _entities: IEntity[] = [];

    public constructor(size?: SceneSize) {
        this._canvas = new Canvas(size);
        this._looper = new Looper();
        this._input = new Input();
        this._renderer = new Renderer(this._canvas.getSize(), this._canvas.getContextGpu());
    }

    public async init(): Promise<void> {
        await this._renderer.init();
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

            this._renderer.test();
        });
    }

    public pause(): void {
        this._looper.pause();
    }

    public getSize(): SceneSize {
        return this._canvas.getSize();
    }
}
