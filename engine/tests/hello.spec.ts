import { describe, expect, it } from "@jest/globals";

import { hello } from "@src/hello";

describe("test", () => {
    it("test", () => {
        hello();
        expect(true).toBe(true);
    });
});
