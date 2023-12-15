import type { IInput } from "../../core/input";
import type { ILooper } from "../../core/looper";
import type { IShapeRenderer } from "../../core/renderer";
import { Entity, type IEntity, type EntityParams } from "../entity";
import type { IScene } from "./iscene";

interface SceneParams {
    input: IInput;
    looper: ILooper;
    shapeRenderer: IShapeRenderer;
}

export class Scene implements IScene {
    private readonly _input: IInput;
    private readonly _looper: ILooper;
    private readonly _shapeRenderer: IShapeRenderer;

    private readonly _entities: IEntity[] = [];

    public constructor(params: SceneParams) {
        const {
            input,
            looper,
            shapeRenderer,
        } = params;

        this._input = input;
        this._looper = looper;
        this._shapeRenderer = shapeRenderer;
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

                this._shapeRenderer.drawFilledRectangle(
                    entity.transform.position.x,
                    entity.transform.position.y,
                    1,
                    1,
                    [0, 1, 0, 1],
                );
            }
        });
    }

    public pause(): void {
        this._looper.pause();
    }
}
