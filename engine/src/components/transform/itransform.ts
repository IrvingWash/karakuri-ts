import type { IVector2 } from "../../math/vector2";

export interface ITransform {
    readonly position: IVector2;
    readonly rotation: IVector2;
    readonly scale: IVector2;
}
