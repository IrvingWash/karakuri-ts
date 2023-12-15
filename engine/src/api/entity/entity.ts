import type { IEntity } from "./ientity";
import type { IInput } from "../../core/input";
import { Transform, type ITransform } from "../../components/transform";
import { Behavior } from "../../components/behavior";
import type { IShapeRenderer } from "../../components/shape-renderer";
import type { ISpriteRenderer } from "../../components/sprite-renderer";
import { IRenderer } from "../../core/renderer";

export interface EntityParams {
    transform?: ITransform;
    behavior?: Behavior;
    shapeRenderer?: IShapeRenderer;
    spriteRenderer?: ISpriteRenderer;
}

export class Entity implements IEntity {
    public readonly transform: ITransform;
    public readonly behavior?: Behavior;
    public readonly shapeRenderer?: IShapeRenderer;
    public readonly spriteRenderer?: ISpriteRenderer;

    public constructor(params: EntityParams) {
        this.transform = params.transform ?? new Transform();
        this.behavior = params.behavior;
        this.shapeRenderer = params.shapeRenderer;
        this.spriteRenderer = params.spriteRenderer;
    }

    public async __init(input: IInput, renderer: IRenderer): Promise<void> {
        this.shapeRenderer?.__init(renderer, this.transform);
        await this.spriteRenderer?.__init(renderer, this.transform);

        this.behavior?.__init({
            transform: this.transform,
            input,
            shapeRenderer: this.shapeRenderer,
            spriteRenderer: this.spriteRenderer,
        });
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
