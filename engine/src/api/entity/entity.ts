import type { IInput } from "../../core/input";
import { Transform } from "../../components/transform";
import { Behavior } from "../../components/behavior";
import type { IAssetStorage } from "../../core/asset-storage";
import { Geometry, Rectangle } from "../../core/geometry";
import type { ISprite } from "../../core/sprite-renderer";
import type { EntityParams, IEntity, IParticle, ITransform } from "../../core/objects";

export class Entity implements IEntity {
    public readonly transform: ITransform;
    public geometry!: Geometry;
    public readonly behavior?: Behavior;
    public readonly sprite?: ISprite;
    public readonly particle?: IParticle;

    public constructor(params: EntityParams) {
        this.transform = params.transform ?? new Transform();
        this.behavior = params.behavior;
        this.sprite = params.sprite;
        this.particle = params.particle;
    }

    public async __init(input: IInput, assetStorage: IAssetStorage): Promise<void> {
        await this.sprite?.__init(assetStorage);

        this.geometry = new Rectangle({
            transform: this.transform,
            originalWidth: this.sprite?.clip.width,
            originalHeight: this.sprite?.clip.height,
        });

        this.particle?.__init(this.transform.position);

        this.behavior?.__init({
            transform: this.transform,
            input,
            sprite: this.sprite,
            particle: this.particle,
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
