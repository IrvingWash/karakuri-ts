import type { ITransform } from "../../components/transform";
import type { Behavior } from "../../components/behavior";
import type { IInput } from "../../core/input";
import type { IRenderer } from "../../core/renderer";
import type { ISprite } from "../../components/sprite";
import type { IAssetStorage } from "../../core/asset-storage";

export interface IEntity {
    readonly transform: ITransform;
    readonly behavior?: Behavior
    readonly sprite?: ISprite;

    __init(input: IInput, assetStorage: IAssetStorage, renderer: IRenderer): Promise<void>;
    start(): void;
    update(deltaTime: number): void;
    reactToCollision(other: IEntity): void;
    destroy(): void;
}
