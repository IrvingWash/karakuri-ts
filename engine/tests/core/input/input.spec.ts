import { describe, expect, it } from "@jest/globals";

import { type IInput, Input } from "../../../src/core/input";

const ENTER = "enter";
const SPACE = " ";

describe("Input", () => {
    it("should set key's state to true when it's being pressed", () => {
        const input: IInput = new Input();

        window.dispatchEvent(createKeyboardEvent("keydown", ENTER));
        window.dispatchEvent(createKeyboardEvent("keydown", SPACE));

        expect(input.isKeyDown(ENTER)).toBe(true);
        expect(input.isKeyDown(SPACE)).toBe(true);
    });

    it ("should set key's state to false when it's unpressed", () => {
        const input: IInput = new Input();

        window.dispatchEvent(createKeyboardEvent("keydown", ENTER));
        window.dispatchEvent(createKeyboardEvent("keydown", SPACE));

        expect(input.isKeyDown(ENTER)).toBe(true);
        expect(input.isKeyDown(SPACE)).toBe(true);

        window.dispatchEvent(createKeyboardEvent("keyup", ENTER));

        expect(input.isKeyDown(ENTER)).toBe(false);
        expect(input.isKeyDown(SPACE)).toBe(true);

        window.dispatchEvent(createKeyboardEvent("keyup", SPACE));

        expect(input.isKeyDown(ENTER)).toBe(false);
        expect(input.isKeyDown(SPACE)).toBe(false);
    });

    it("should return `false` for the keys that weren't pressed yet", () => {
        const input: IInput = new Input();

        expect(input.isKeyDown(ENTER)).toBe(false);
    });
});

function createKeyboardEvent(type: "keydown" | "keyup", key: string): KeyboardEvent {
    return new KeyboardEvent(type, { key });
}
