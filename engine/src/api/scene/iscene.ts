import type { EntityParams, IEntity } from "../../core/objects";

export interface IScene {
    createEntity(params: EntityParams): Promise<IEntity>;
    start(): void;
    pause(): void;
    getEntity(name: string): IEntity | undefined;
    removeEntity(entityToRemove: IEntity): void;
}
