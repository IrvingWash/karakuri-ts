import { type IVector2 } from "../math/vector2";
import { type IAssetStorage } from "./asset-storage";
import { Geometry } from "./geometry";
import { type IInput } from "./input";
import { type ISprite } from "./sprite-renderer";

export type RGBA = [number, number, number, number];

export interface ITransform {
    position: IVector2;
    rotation: IVector2;
    scale: IVector2;
}

export interface IEntity {
    readonly name: string;
    readonly transform: ITransform;
    readonly geometry: Geometry;
    readonly behavior?: IBehavior
    readonly sprite?: ISprite;

    __init(
        input: IInput,
        assetStorage: IAssetStorage,
        entityGetter: (name: string) => IEntity | undefined
    ): Promise<void>;

    start(): void;
    update(deltaTime: number): void;
    reactToCollision(other: IEntity): void;
    destroy(): void;
}

export interface IBehavior {
    transform: ITransform;
    input: IInput;
    sprite?: ISprite;

    __init(params: BehaviorParams): void;

    getEntity(name: string): IEntity | undefined;
    onStart?(): void;
    onUpdate?(deltaTime: number): void;
    onCollision?(other: IEntity): void;
    onDestroy?(): void;
}

export interface EntityParams {
    name: string;
    transform?: ITransform;
    behavior?: IBehavior;
    sprite?: ISprite;
}

export interface BehaviorParams {
    transform: ITransform;
    input: IInput;
    entityGetter: (name: string) => IEntity | undefined;
    sprite?: ISprite;
}
