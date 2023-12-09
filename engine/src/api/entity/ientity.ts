import type { ITransform } from "../../components/transform";

export interface IEntity {
    readonly transform: ITransform;

    start(): void;
    update(deltaTime: number): void;
    reactToCollision(other: IEntity): void;
    destroy(): void;
}
