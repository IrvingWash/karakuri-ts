import type { ITransform } from "../transform";
import type { IInput } from "../../core/input";
import type { IEntity } from "../../api/entity";
import { IShapeRenderer } from "../shape-renderer";

export abstract class Behavior {
    public transform!: ITransform;
    public input!: IInput;
    public shapeRenderer?: IShapeRenderer;

    public __init(transform: ITransform, input: IInput, shapeRenderer?: IShapeRenderer): void {
        this.transform = transform;
        this.input = input;
        this.shapeRenderer = shapeRenderer;
    }

    public onStart?(): void;
    public onUpdate?(deltaTime: number): void;
    public onCollision?(other: IEntity): void;
    public onDestroy?(): void;
}
