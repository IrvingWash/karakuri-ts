import { IAssetStorage } from "../../src/core/asset-storage";
import { Texture } from "../../src/core/sprite-renderer";
import { MockGpuSampler, MockGpuTexture } from "./gpu-mocks";
import { MockTexture } from "./mock-sprite-renderer";

export class MockAssetStorage implements IAssetStorage {
    private _textures: Map<string, MockTexture> = new Map();

    public async addTexture(path: string): Promise<void> {
        const texture: MockTexture = {
            id: path,
            sampler: new MockGpuSampler(),
            texture: new MockGpuTexture(1000, 1000),
        };

        this._textures.set(path, texture);
    }

    public getTexture(path: string): MockTexture | undefined {
        return this._textures.get(path) as unknown as Texture;
    }
}
