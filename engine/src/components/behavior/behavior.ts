import type { ITransform } from "../transform";
import type { IInput } from "../../core/input";
import type { IEntity } from "../../api/entity";
import type { ISprite } from "../sprite";

interface BehaviorParams {
    transform: ITransform;
    input: IInput;
    sprite?: ISprite,
}

export abstract class Behavior {
    public transform!: ITransform;
    public input!: IInput;
    public sprite?: ISprite;

    public __init(params: BehaviorParams): void {
        this.transform = params.transform;
        this.input = params.input;
        this.sprite = params.sprite;
    }

    public onStart?(): void;
    public onUpdate?(deltaTime: number): void;
    public onCollision?(other: IEntity): void;
    public onDestroy?(): void;
}
