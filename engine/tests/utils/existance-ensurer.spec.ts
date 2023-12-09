import { describe, it, expect } from "@jest/globals";

import { ensureExists } from "../../src/utils/existence-ensurer";

describe("ensureExists", () => {
    it("should throw an error with the predefined message when an undefined value is passed", () => {
        expect(() => ensureExists(undefined)).toThrowError("Value is undefined");
    });

    it("should throw an error with the predefined message when null is passed", () => {
        expect(() => ensureExists(null)).toThrowError("Value is null");
    });

    it("should throw an error with a passed message when an undefined value is passed", () => {
        const message = "Ico";

        expect(() => ensureExists(undefined, message)).toThrowError(message);
    });

    it("should throw an error with a passed message when null is passed", () => {
        const message = "Bloodborne";

        expect(() => ensureExists(null, message)).toThrowError(message);
    });

    it("should return the passed existing value", () => {
        const a = ["Killer7"];
        const b = { game: "Dark Souls" };
        const c = 13;
        const d = "Wonderful 101";

        expect(ensureExists(a)).toBe(a);
        expect(ensureExists(b, "Baten Kaitos")).toBe(b);
        expect(ensureExists(c)).toEqual(c);
        expect(ensureExists(d, "Prey")).toEqual(d);
    });
});
