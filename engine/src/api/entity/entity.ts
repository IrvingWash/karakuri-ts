import type { IEntity } from "./ientity";
import type { IInput } from "../../core/input";
import { Transform, type ITransform } from "../../components/transform";
import { Behavior } from "../../components/behavior";
import type { IShapeRenderer } from "../../components/shape-renderer";
import { IRenderer } from "../../core/renderer";

export interface EntityParams {
    transform?: ITransform;
    behavior?: Behavior;
    shapeRenderer?: IShapeRenderer;
}

export class Entity implements IEntity {
    public readonly transform: ITransform;
    public readonly behavior?: Behavior;
    public readonly shapeRenderer?: IShapeRenderer;

    public constructor(params: EntityParams) {
        this.transform = params.transform ?? new Transform();
        this.behavior = params.behavior;
        this.shapeRenderer = params.shapeRenderer;
    }

    public __init(input: IInput, renderer: IRenderer): void {
        this.shapeRenderer?.__init(renderer, this.transform);

        this.behavior?.__init(this.transform, input, this.shapeRenderer);
    }

    public start(): void {
        this.behavior?.onStart?.();
    }

    public update(deltaTime: number): void {
        this.behavior?.onUpdate?.(deltaTime);
    }

    public reactToCollision(other: IEntity): void {
        this.behavior?.onCollision?.(other);
    }

    public destroy(): void {
        this.behavior?.onDestroy?.();
    }
}
