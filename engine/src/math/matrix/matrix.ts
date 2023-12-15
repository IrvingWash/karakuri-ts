export class Matrix4 {
    public readonly values = new Float32Array(16);

    public constructor() {}

    public orthogonalProjection(
        left: number,
        right: number,
        bottom: number,
        top: number,
        near: number,
        far: number,
    ): Matrix4 {
        const leftRight = 1 / (left - right);
        const bottomTop = 1 / (bottom - top);
        const nearFar = 1 / (near - far);

        this.values.set([
            -2 * leftRight,
            0, 0, 0, 0,
            -2 * bottomTop,
            0, 0, 0, 0,
            2 * nearFar,
            0,
            (left + right) * leftRight,
            (bottom + top) * bottomTop,
            (near + far) * nearFar,
            1,
        ]);

        return this;
    }
}
