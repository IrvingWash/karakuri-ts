import type { ITransform } from "../../components/transform";
import type { Behavior } from "../../components/behavior";
import { IInput } from "../../core/input";
import { IRenderer } from "../../core/renderer";
import { IShapeRenderer } from "../../components/shape-renderer";

export interface IEntity {
    readonly transform: ITransform;
    readonly behavior?: Behavior
    readonly shapeRenderer?: IShapeRenderer;

    __init(input: IInput, renderer: IRenderer): void;
    start(): void;
    update(deltaTime: number): void;
    reactToCollision(other: IEntity): void;
    destroy(): void;
}
