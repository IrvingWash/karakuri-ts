import { IMatrix4 } from "./imatrix";

export class Matrix4 implements IMatrix4 {
    public readonly values = new Float32Array(16);

    public constructor(values: Float32Array = new Float32Array(16)) {
        if (values.length !== 16) {
            throw new Error(`Cannot instantiate Matrix4 with ${values.length} elements`);
        }

        this.values = values;
    }

    public orthogonalProjection(
        left: number,
        right: number,
        bottom: number,
        top: number,
        near: number,
        far: number,
    ): IMatrix4 {
        const widthPerPixel = 1 / (left - right);
        const heightPerPixel = 1 / (bottom - top);
        const depthPerPixel = 1 / (near - far);

        this.values[0] = widthPerPixel * -2;
        this.values[5] = heightPerPixel * -2;
        this.values[10] = 2 * depthPerPixel,
        this.values[12] = (left + right) * widthPerPixel,
        this.values[13] = (bottom + top) * heightPerPixel,
        this.values[14] = (near + far) * depthPerPixel,

        this.values[1] = 0;
        this.values[2] = 0;
        this.values[3] = 0;
        this.values[4] = 0;
        this.values[6] = 0;
        this.values[7] = 0;
        this.values[8] = 0;
        this.values[9] = 0;
        this.values[11] = 0;
        this.values[15] = 1;

        return this;
    }
}
