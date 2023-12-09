import { ILooper } from "./ilooper";
import { LooperCallback } from "./looper-objects";

const SECONDS_IN_MILLISECOND = 1 / 1000;

export class Looper implements ILooper {
    private _loopId: number | null = null;
    private _previousFrameTime: number = 0;
    private _deltaTime: number = 0;

    public start = (cb: LooperCallback): void => {
        this._loopId = requestAnimationFrame((currentTime) => {
            this._deltaTime = this._calculateDeltaTime(currentTime);

            this._previousFrameTime = currentTime;

            this.start(cb);
        });

        cb(this._deltaTime);
    };

    public pause = (): void => {
        if (this._loopId !== null) {
            cancelAnimationFrame(this._loopId);
        }

        this._previousFrameTime = 0;
        this._deltaTime = 0;
        this._loopId = null;
    };

    private _calculateDeltaTime(currentTime: number): number {
        return (currentTime - this._previousFrameTime) * SECONDS_IN_MILLISECOND;
    }
}
