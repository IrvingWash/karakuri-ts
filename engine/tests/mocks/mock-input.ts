import { IInput } from "../../src/core/input";

export class MockInput implements IInput {
    public isKeyDown(_key: string): boolean {
        throw new Error("Method not implemented.");
    }

    public isKeyUp(_key: string): boolean {
        throw new Error("Method not implemented.");
    }
}
