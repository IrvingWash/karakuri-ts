import type { IEntity } from "./ientity";
import type { IInput } from "../../core/input";
import { Transform, type ITransform } from "../../components/transform";
import { Behavior } from "../../components/behavior";
import type { ISpriteRenderer } from "../../components/sprite-renderer";
import type { IRenderer } from "../../core/renderer";
import type { IAssetStorage } from "../../core/asset-storage";

export interface EntityParams {
    transform?: ITransform;
    behavior?: Behavior;
    spriteRenderer?: ISpriteRenderer;
}

export class Entity implements IEntity {
    public readonly transform: ITransform;
    public readonly behavior?: Behavior;
    public readonly spriteRenderer?: ISpriteRenderer;

    public constructor(params: EntityParams) {
        this.transform = params.transform ?? new Transform();
        this.behavior = params.behavior;
        this.spriteRenderer = params.spriteRenderer;
    }

    public async __init(input: IInput, assetStorage: IAssetStorage, renderer: IRenderer): Promise<void> {
        await this.spriteRenderer?.__init(renderer, this.transform, assetStorage);

        this.behavior?.__init({
            transform: this.transform,
            input,
            spriteRenderer: this.spriteRenderer,
        });
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
