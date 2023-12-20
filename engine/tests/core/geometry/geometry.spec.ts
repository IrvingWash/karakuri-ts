import { describe, expect, it } from "@jest/globals";

import { Rectangle, Geometry } from "../../../src/core/geometry";
import { Transform } from "../../../src/components/transform";
import { Vector2 } from "../../../src/math/vector2";
import { Trigonometry } from "../../../src/math/trigonometry";

describe("Rectangles", () => {
    it("should calculate world vertices", () => {
        const rectangle: Geometry = new Rectangle({
            transform: new Transform({
                position: new Vector2(-300, 22),
                scale: new Vector2(3, 0.5),
                rotation: new Vector2(Trigonometry.degToRad(45), 0),
            }),
            originalHeight: 100,
            originalWidth: 100,
        });

        rectangle.updateWorldVertices();

        expect(rectangle.worldVertices).toEqual([
            -300, 22,
            -87.86796564403573, 234.13203435596424,
            -123.22330470336311, 269.4873734152916,
            -335.3553390593274, 57.35533905932738,
        ]);
    });
});
