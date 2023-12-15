import { Matrix4, type IMatrix4 } from "../../../math/matrix";
import { CanvasSize } from "../../canvas";
import { IViewPort } from "./ivew-port";

export class ViewPort implements IViewPort {
    public readonly projectionMatrix: IMatrix4;

    public constructor(size: CanvasSize) {
        this.projectionMatrix = new Matrix4().orthogonalProjection(0, size.width, size.height, 0, -1, 1);
    }
}
