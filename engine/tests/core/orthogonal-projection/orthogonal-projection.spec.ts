import { describe, expect, it } from "@jest/globals";

import { IOrthogonalProjection, OrthogonalProjection } from "../../../src/core/orthogonal-projection";
import { Matrix4 } from "../../../src/math/matrix";

describe("OrthogonalProjection", () => {
    it("should project WebGPU space to canvas size", () => {
        const op: IOrthogonalProjection = new OrthogonalProjection({ width: 1920, height: 1080 });

        expect(op.projectionMatrix).toEqual(new Matrix4(new Float32Array([
            0.0010416667209938169,
            0, 0, 0, 0,
            -0.0018518518190830946,
            0, 0, 0, 0,
            -1, 0, -1, 1, -0, 1,
        ])));
    });
});
