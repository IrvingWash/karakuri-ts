import { describe, expect, it } from "@jest/globals";

import { Vector2 } from "../../../src/math/vector2";
import { Matrix4 } from "../../../src/math/matrix";

describe("Matrix4", () => {
    it("should create orthogonal projection", () => {
        const v = new Vector2(1920, 1080);

        const projectionMatrix = new Matrix4().orthogonalProjection(0, v.x, v.y, 0, -1, 1);

        expect(projectionMatrix.values).toEqual(new Float32Array([
            0.0010416667209938169,
            0, 0, 0, 0,
            -0.0018518518190830946,
            0, 0, 0, 0,
            -1,
            0,
            -1,
            1,
            -0,
            1,
        ]));
    });
});
