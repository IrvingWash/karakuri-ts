import { describe, expect, it } from "@jest/globals";

import { clamp } from "../../src/utils/clamp";

describe("clamp", () => {
    it("should clamp numbers", () => {
        let result = clamp(5, 3, 10);

        expect(result).toEqual(5);

        result = clamp(2, 3, 10);

        expect(result).toEqual(3);

        result = clamp(11, 3, 10);

        expect(result).toEqual(10);

        result = clamp(7, 10, 3);

        expect(result).toEqual(3);
    });
});
