import { Transform, type ITransform } from "../../components/transform";
import type { IEntity } from "./ientity";
import type { IInput } from "../../core/input";
import { Behavior } from "../../components/behavior";

export interface EntityParams {
    transform?: ITransform;
    behavior?: Behavior;
}

export class Entity implements IEntity {
    public readonly transform: ITransform;
    public readonly behavior?: Behavior;

    public constructor(params: EntityParams) {
        this.transform = params.transform ?? new Transform();
        this.behavior = params.behavior;
    }

    public __init(input: IInput): void {
        this.behavior?.__init(this.transform, input);
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
