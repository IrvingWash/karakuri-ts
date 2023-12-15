export interface IMatrix4 {
    readonly values: Float32Array;

    orthogonalProjection(
        left: number,
        right: number,
        bottom: number,
        top: number,
        near: number,
        far: number,
    ): IMatrix4;
}
