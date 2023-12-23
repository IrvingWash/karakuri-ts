import { IVector2 } from "../math/vector2";
import { IAssetStorage } from "./asset-storage";
import { Geometry } from "./geometry";
import { IInput } from "./input";
import { ISprite } from "./sprite-renderer";

export type RGBA = [number, number, number, number];

export interface ITransform {
    readonly position: IVector2;
    readonly rotation: IVector2;
    readonly scale: IVector2;
}

export interface IEntity {
    readonly transform: ITransform;
    readonly geometry: Geometry;
    readonly behavior?: IBehavior
    readonly sprite?: ISprite;

    __init(input: IInput, assetStorage: IAssetStorage): Promise<void>;
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

    onStart?(): void;
    onUpdate?(deltaTime: number): void;
    onCollision?(other: IEntity): void;
    onDestroy?(): void;
}

export interface EntityParams {
    transform?: ITransform;
    behavior?: IBehavior;
    sprite?: ISprite;
}

export interface BehaviorParams {
    transform: ITransform;
    input: IInput;
    sprite?: ISprite,
}
