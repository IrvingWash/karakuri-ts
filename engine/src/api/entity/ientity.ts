import type { ITransform } from "../../components/transform";
import type { Behavior } from "../../components/behavior";
import type { IInput } from "../../core/input";
import type { IRenderer } from "../../core/renderer";
import type { ISpriteRenderer } from "../../components/sprite-renderer";
import type { IAssetStorage } from "../../core/asset-storage";

export interface IEntity {
    readonly transform: ITransform;
    readonly behavior?: Behavior
    readonly spriteRenderer?: ISpriteRenderer;

    __init(input: IInput, assetStorage: IAssetStorage, renderer: IRenderer): Promise<void>;
    start(): void;
    update(deltaTime: number): void;
    reactToCollision(other: IEntity): void;
    destroy(): void;
}
