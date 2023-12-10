import type { ITransform } from "../transform";
import type { IInput } from "../../core/input";
import type { IEntity } from "../../api/entity";

export abstract class Behavior {
    public transform!: ITransform;
    public input!: IInput;

    public __init(transform: ITransform, input: IInput): void {
        this.transform = transform;
        this.input = input;
    }

    public onStart?(): void;
    public onUpdate?(deltaTime: number): void;
    public onCollision?(other: IEntity): void;
    public onDestroy?(): void;
}
