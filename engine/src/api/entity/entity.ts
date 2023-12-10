import { Transform, type ITransform } from "../../components/transform";
import type { IEntity } from "./ientity";
import type { IInput } from "../../core/input";

export interface EntityParams {
    transform?: ITransform;
}

export class Entity implements IEntity {
    public readonly transform: ITransform;

    public constructor(params: EntityParams) {
        this.transform = params.transform ?? new Transform();
    }

    public __init(input: IInput): void {
        console.log(input);
    }

    public start(): void {
    }

    public update(deltaTime: number): void {
        console.log(deltaTime);
    }

    public reactToCollision(other: IEntity): void {
        console.log(other);
    }

    public destroy(): void {
    }
}
