import type { IEntity, EntityParams } from "../entity";

export interface IScene {
    createEntity(params: EntityParams): IEntity;
    start(): void;
    pause(): void;
}
