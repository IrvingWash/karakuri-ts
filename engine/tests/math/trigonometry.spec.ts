import { describe, expect, it } from "@jest/globals";

import { Trigonometry } from "../../src/math/trigonometry";

describe("Trigonometry", () => {
    const degrees = 90;
    const radians = 1.5708;

    it("should convert degrees to radians", () => {
        expect(Trigonometry.degToRad(degrees)).toEqual(1.5707963267948966);
        expect(Trigonometry.degToRad(-degrees)).toEqual(-1.5707963267948966);
    });

    it("should convert radians to degress", () => {
        expect(Trigonometry.radToDeg(radians)).toEqual(90.00021045914971);
        expect(Trigonometry.radToDeg(-radians)).toEqual(-90.00021045914971);
    });
});
