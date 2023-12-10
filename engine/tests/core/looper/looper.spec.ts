import { describe, expect, it, jest } from "@jest/globals";

import { type ILooper, Looper } from "../../../src/core/looper";

jest.useFakeTimers();

const looperCallback = jest.fn();

describe("Looper", () => {
    it("should call LooperCallback constantly", () => {
        const looper: ILooper = new Looper();

        looper.start(looperCallback);

        setTimeout(() => {
            expect(looperCallback).toHaveBeenCalledTimes(63);
        }, 1000);

        jest.advanceTimersByTime(1000);
    });

    it("should stop calling LooperCallback when paused", () => {
        const looper: ILooper = new Looper();

        looper.start(looperCallback);

        setTimeout(() => {
            expect(looperCallback).toHaveBeenCalledTimes(63);
        }, 1000);

        looper.pause();

        setTimeout(() => {
            expect(looperCallback).toHaveBeenCalledTimes(64);
        }, 1000);
    });
});
