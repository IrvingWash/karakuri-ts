import { LooperCallback } from "./looper-objects";

export interface ILooper {
    start(cb: LooperCallback): void;
    pause(): void;
}
