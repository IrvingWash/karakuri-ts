import type { IInput } from "../../core/input";
import type { ISprite } from "../../core/sprite-renderer";
import type { BehaviorParams, IBehavior, IEntity, ITransform } from "../../core/objects";

export abstract class Behavior implements IBehavior {
    public transform!: ITransform;
    public getEntity!: (name: string) => IEntity | undefined;
    public input!: IInput;
    public sprite?: ISprite;

    public __init(params: BehaviorParams): void {
        this.transform = params.transform;
        this.input = params.input;
        this.sprite = params.sprite;
        this.getEntity = params.entityGetter;
    }

    public onStart?(): void;
    public onUpdate?(deltaTime: number): void;
    public onCollision?(other: IEntity): void;
    public onDestroy?(): void;
}
