import { Vector2, type IVector2 } from "../../math/vector2";
import { ITransform } from "./itransform";

export interface TransformParams {
    position?: IVector2;
    rotation?: IVector2;
    scale?: IVector2;
}

export class Transform implements ITransform {
    public position: IVector2;
    public rotation: IVector2;
    public scale: IVector2;

    public constructor(params?: TransformParams) {
        this.position = params?.position ?? new Vector2();
        this.rotation = params?.rotation ?? new Vector2();
        this.scale = params?.scale ?? new Vector2(1, 1);
    }
}
