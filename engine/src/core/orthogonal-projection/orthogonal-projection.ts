import { Matrix4, type IMatrix4 } from "../../math/matrix";
import { type CanvasSize } from "../canvas";
import { type IOrthogonalProjection } from "./iorthogonal-projection";
import { Vector2, type IVector2 } from "../../math/vector2";

export class OrthogonalProjection implements IOrthogonalProjection {
    public readonly projectionMatrix: IMatrix4;

    private readonly _position: IVector2;

    public constructor(size: CanvasSize) {
        this._position = new Vector2();

        this.projectionMatrix = new Matrix4().orthogonalProjection(
            this._position.x, size.width,
            size.height, this._position.y,
            -1, 1,
        );
    }
}
