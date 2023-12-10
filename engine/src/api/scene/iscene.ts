import type { IEntity, EntityParams } from "../entity";
import { SceneSize } from "./scene-objects";

export interface IScene {
    init(): Promise<void>;
    createEntity(params: EntityParams): IEntity;
    start(): void;
    pause(): void;
    getSize(): SceneSize;
}
