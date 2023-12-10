import type { ITransform } from "../../components/transform";
import type { Behavior } from "../../components/behavior";

export interface IEntity {
    readonly transform: ITransform;
    readonly behavior?: Behavior

    start(): void;
    update(deltaTime: number): void;
    reactToCollision(other: IEntity): void;
    destroy(): void;
}
