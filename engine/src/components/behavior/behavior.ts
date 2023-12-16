import type { ITransform } from "../transform";
import type { IInput } from "../../core/input";
import type { IEntity } from "../../api/entity";
import type { ISpriteRenderer } from "../sprite-renderer";

interface BehaviorParams {
    transform: ITransform;
    input: IInput;
    spriteRenderer?: ISpriteRenderer,
}

export abstract class Behavior {
    public transform!: ITransform;
    public input!: IInput;
    public spriteRenderer?: ISpriteRenderer;

    public __init(params: BehaviorParams): void {
        this.transform = params.transform;
        this.input = params.input;
        this.spriteRenderer = params.spriteRenderer;
    }

    public onStart?(): void;
    public onUpdate?(deltaTime: number): void;
    public onCollision?(other: IEntity): void;
    public onDestroy?(): void;
}
