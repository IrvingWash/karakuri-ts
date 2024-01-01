import { IAssetStorage } from "../../../src/core/asset-storage";
import { IInput } from "../../../src/core/input";
import { Texture } from "../../../src/core/sprite-renderer";

export class MockAssetStorage implements IAssetStorage {
    public addTexture(_path: string, _antialias?: boolean | undefined): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public getTexture(_path: string): Texture | undefined {
        throw new Error("Method not implemented.");
    }
}

export class MockInput implements IInput {
    public isKeyDown(_key: string): boolean {
        throw new Error("Method not implemented.");
    }

    public isKeyUp(_key: string): boolean {
        throw new Error("Method not implemented.");
    }
}
