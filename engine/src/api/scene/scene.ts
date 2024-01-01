import type { IAssetStorage } from "../../core/asset-storage";
import type { IInput } from "../../core/input";
import type { ILooper } from "../../core/looper";
import type { EntityParams, IEntity } from "../../core/objects";
import type { ISpriteRenderer } from "../../core/sprite-renderer";
import { Entity } from "../entity";
import type { IPhysicsAffector } from "../physics-affector";
import type { IScene } from "./iscene";

interface SceneParams {
    input: IInput;
    looper: ILooper;
    spriteRenderer: ISpriteRenderer;
    assetStorage: IAssetStorage;
    physicsAffector: IPhysicsAffector;
}

export class Scene implements IScene {
    private readonly _input: IInput;
    private readonly _looper: ILooper;
    private readonly _spriteRenderer: ISpriteRenderer;
    private readonly _assetStorage: IAssetStorage;
    private readonly _physicsAffector: IPhysicsAffector;

    private readonly _entities: IEntity[] = [];

    public constructor(params: SceneParams) {
        const {
            input,
            looper,
            spriteRenderer,
            assetStorage,
            physicsAffector,
        } = params;

        this._input = input;
        this._looper = looper;
        this._spriteRenderer = spriteRenderer;
        this._assetStorage = assetStorage;
        this._physicsAffector = physicsAffector;
    }

    public async createEntity(params: EntityParams): Promise<IEntity> {
        const entity: IEntity = new Entity(params);

        await entity.__init(this._input, this._assetStorage);
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
                this._physicsAffector.affect(entity, deltaTime);
            }

            this._spriteRenderer.beginDrawing();
            for (const entity of this._entities) {
                if (entity.sprite === undefined) {
                    continue;
                }

                this._spriteRenderer.queueDraw(
                    entity.sprite,
                    entity.geometry.worldVertices,
                );
            }
            this._spriteRenderer.finishDrawing();
        });
    }

    public pause(): void {
        this._looper.pause();
    }
}
