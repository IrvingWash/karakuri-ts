import { type IVector2 } from "../math/vector2";
import { type IParticlePhysics } from "../physics/particle";
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

export interface IParticle {
    __init(position: IVector2): void;
    getParticlePhysics(): IParticlePhysics;
}

export interface IEntity {
    readonly transform: ITransform;
    readonly geometry: Geometry;
    readonly behavior?: IBehavior
    readonly sprite?: ISprite;
    readonly particle?: IParticle

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
    particle?: IParticle;
}

export interface BehaviorParams {
    transform: ITransform;
    input: IInput;
    sprite?: ISprite;
    particle?: IParticle;
}
