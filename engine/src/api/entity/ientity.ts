import type { ITransform } from "../../components/transform";
import type { Behavior } from "../../components/behavior";
import { IInput } from "../../core/input";

export interface IEntity {
    readonly transform: ITransform;
    readonly behavior?: Behavior

    __init(input: IInput): void;
    start(): void;
    update(deltaTime: number): void;
    reactToCollision(other: IEntity): void;
    destroy(): void;
}
