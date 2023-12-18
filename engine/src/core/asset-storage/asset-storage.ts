import { Texture } from "../sprite-renderer";
import { IAssetStorage } from "./iasset-storage";

export class AssetStorage implements IAssetStorage {
    private readonly _device: GPUDevice;
    private readonly _textures: Map<string, Texture> = new Map();

    public constructor(device: GPUDevice) {
        this._device = device;
    }

    public getTexture(path: string): Texture | undefined {
        return this._textures.get(path);
    }

    public async addTexture(path: string, antialias: boolean = false): Promise<void> {
        if (this._textures.get(path) !== undefined) {
            return;
        }

        const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
            const image = new Image();
            image.src = path;

            image.onload = (): void => resolve(image);
            image.onerror = (): void => reject(`Failed to load image ${path}`);
        });

        const image = await imageLoadPromise;

        const filterMode: GPUFilterMode = antialias ? "linear" : "nearest";
        const sampler = this._device.createSampler({
            magFilter: filterMode,
            minFilter: filterMode,
        });

        const texture = {
            id: image.src,
            texture: this._device.createTexture({
                size: { width: image.width, height: image.height },
                format: navigator.gpu.getPreferredCanvasFormat(),
                usage: GPUTextureUsage.COPY_DST
                    | GPUTextureUsage.TEXTURE_BINDING
                    | GPUTextureUsage.RENDER_ATTACHMENT,
            }),
            sampler,
        };

        const data = await createImageBitmap(image);

        this._device.queue.copyExternalImageToTexture(
            { source: data },
            { texture: texture.texture },
            { width: image.width, height: image.height },
        );

        this._textures.set(path, texture);
    }
}
