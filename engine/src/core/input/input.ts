import type { IInput } from "./iinput";

export class Input implements IInput {
    private _keyStates: Record<string, boolean> = {};

    public constructor() {
        window.addEventListener("keydown", (event) => this._keyStates[event.key] = true);
        window.addEventListener("keyup", (event) => this._keyStates[event.key] = false);
    }

    public isKeyDown(key: string): boolean {
        return this._keyStates[key] ?? false;
    }

    public isKeyUp(key: string): boolean {
        return !this._keyStates[key] ?? true;
    }
}
