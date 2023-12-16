import { Texture } from "../sprite-renderer";

export interface IAssetStorage {
    addTexture(path: string, device: GPUDevice, antialias?: boolean): Promise<void>;
    getTexture(path: string): Texture | undefined;
}
