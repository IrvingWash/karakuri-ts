import { Transform, type ITransform } from "../../components/transform";
import type { IEntity } from "./ientity";
import type { IInput } from "../../core/input";

interface EntityParams {
    transform?: ITransform;
}

export class Entity implements IEntity {
    public readonly transform: ITransform;

    public constructor(params: EntityParams) {
        this.transform = params.transform ?? new Transform();
    }

    public __init(input: IInput): void {
    }

    public start(): void {
    }

    public update(deltaTime: number): void {
    }

    public reactToCollision(other: IEntity): void {
    }

    public destroy(): void {
    }
}
