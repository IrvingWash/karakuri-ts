import { IEntity } from "../../core/objects";

export interface IPhysicsAffector {
    affect(entity: IEntity, time: number): void;
}
