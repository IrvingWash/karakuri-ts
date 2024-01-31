import type { IInput } from "../../core/input";
import { Transform } from "../../components/transform";
import { Behavior } from "../../components/behavior";
import type { IAssetStorage } from "../../core/asset-storage";
import { Geometry, Rectangle } from "../../core/geometry";
import type { ISprite } from "../../core/sprite-renderer";
import type { EntityParams, IEntity, ITransform } from "../../core/objects";

export class Entity implements IEntity {
    public readonly name: string;
    public readonly transform: ITransform;
    public geometry!: Geometry;
    public readonly behavior?: Behavior;
    public readonly sprite?: ISprite;

    public constructor(params: EntityParams) {
        this.name = params.name;
        this.transform = params.transform ?? new Transform();
        this.behavior = params.behavior;
        this.sprite = params.sprite;
    }

    public async __init(
        input: IInput,
        assetStorage: IAssetStorage,
        entityGetter: (name: string) => IEntity | undefined,
    ): Promise<void> {
        await this.sprite?.__init(assetStorage);

        this.geometry = new Rectangle({
            transform: this.transform,
            originalWidth: this.sprite?.clip.width,
            originalHeight: this.sprite?.clip.height,
        });

        this.behavior?.__init({
            transform: this.transform,
            input,
            sprite: this.sprite,
            entityGetter,
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
