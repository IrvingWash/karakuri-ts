import type { IEntity, EntityParams } from "../entity";

export interface IScene {
    createEntity(params: EntityParams): Promise<IEntity>;
    start(): void;
    pause(): void;
}
