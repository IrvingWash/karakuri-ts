import { describe, expect, it } from "@jest/globals";

import { Sprite, type ISprite } from "../../../src/components/sprite";
import { ITransform } from "../../../src/components/transform";
import { Vector2 } from "../../../src/math/vector2";
import { MockAssetStorage } from "../../mocks/mock-asset-storage";

const mockTransform: ITransform = {
    position: new Vector2(-100, 100),
    scale: new Vector2(3, 0.5),
    rotation: new Vector2(),
};

describe("Sprite", () => {
    it("should calculate correct vertex data", async() => {
        const sprite: ISprite = new Sprite({
            path: "",
            color: [1, 0, 1, 1],
            clip: {
                height: 100,
                width: 100,
                x: 100,
                y: -100,
            },
        });

        await sprite.__init(mockTransform, new MockAssetStorage());

        const { vertices } = sprite.getDrawData();

        expect(vertices).toEqual([
            /* eslint-disable @stylistic/indent */
            50, 125,
                0.2, 0,
                1, 0, 1, 1,
            50, 75,
                0.2, -0.1,
                1, 0, 1, 1,
            -250, 75,
                0.1, -0.1,
                1, 0, 1, 1,
            -250, 125,
                0.1, 0,
                1, 0, 1, 1,
            /* eslint-enable @stylistic/indent */
        ]);
    });
});
