import type { ITransform } from "../../core/objects";
import { Vector2, type IVector2 } from "../../math/vector2";

export interface TransformParams {
    position?: IVector2;
    rotation?: IVector2;
    scale?: IVector2;
}

export class Transform implements ITransform {
    public readonly position: IVector2;
    public readonly rotation: IVector2;
    public readonly scale: IVector2;

    public constructor(params?: TransformParams) {
        this.position = params?.position ?? new Vector2();
        this.rotation = params?.rotation ?? new Vector2();
        this.scale = params?.scale ?? new Vector2(1, 1);
    }
}
