import type { IEntity } from "./ientity";
import type { IInput } from "../../core/input";
import { Transform } from "../../components/transform";
import { Behavior } from "../../components/behavior";
import type { IAssetStorage } from "../../core/asset-storage";
import type { ITransform } from "../../core/transform";
import { Geometry, Rectangle, RectangleInitParams } from "../../core/geometry";
import { ISprite } from "../../core/sprite-renderer";

export interface EntityParams {
    transform?: ITransform;
    behavior?: Behavior;
    sprite?: ISprite;
}

export class Entity implements IEntity {
    public readonly transform: ITransform;
    public readonly geometry: Geometry<RectangleInitParams>;
    public readonly behavior?: Behavior;
    public readonly sprite?: ISprite;

    public constructor(params: EntityParams) {
        this.transform = params.transform ?? new Transform();
        this.geometry = new Rectangle(this.transform);
        this.behavior = params.behavior;
        this.sprite = params.sprite;
    }

    public async __init(input: IInput, assetStorage: IAssetStorage): Promise<void> {
        await this.sprite?.__init(assetStorage);

        this.geometry.__init({
            originalWidth: this.sprite?.clip.width,
            originalHeight: this.sprite?.clip.height,
        });

        this.behavior?.__init({
            transform: this.transform,
            input,
            sprite: this.sprite,
        });
    }

    public start(): void {
        this.behavior?.onStart?.();
    }

    public update(deltaTime: number): void {
        this.behavior?.onUpdate?.(deltaTime);
        this.geometry.updateWorldVertices();
    }

    public reactToCollision(other: IEntity): void {
        this.behavior?.onCollision?.(other);
    }

    public destroy(): void {
        this.behavior?.onDestroy?.();
    }
}
