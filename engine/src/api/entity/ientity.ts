import type { Behavior } from "../../components/behavior";
import type { IInput } from "../../core/input";
import type { IAssetStorage } from "../../core/asset-storage";
import { Geometry } from "../../core/geometry";
import type { ITransform } from "../../core/transform";
import type { ISprite } from "../../core/sprite-renderer";

export interface IEntity {
    readonly transform: ITransform;
    readonly geometry: Geometry;
    readonly behavior?: Behavior
    readonly sprite?: ISprite;

    __init(input: IInput, assetStorage: IAssetStorage): Promise<void>;
    start(): void;
    update(deltaTime: number): void;
    reactToCollision(other: IEntity): void;
    destroy(): void;
}
