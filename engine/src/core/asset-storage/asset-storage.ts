import { Texture } from "../renderer";
import { IAssetStorage } from "./iasset-storage";

export class AssetStorage implements IAssetStorage {
    private readonly _textures: Map<string, Texture> = new Map();

    public getTexture(path: string): Texture | undefined {
        return this._textures.get(path);
    }

    public async addTexture(path: string, device: GPUDevice, antialias: boolean = false): Promise<void> {
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
        const sampler = device.createSampler({
            magFilter: filterMode,
            minFilter: filterMode,
        });

        const texture = {
            id: image.src,
            texture: device.createTexture({
                size: { width: image.width, height: image.height },
                format: navigator.gpu.getPreferredCanvasFormat(),
                usage: GPUTextureUsage.COPY_DST
                    | GPUTextureUsage.TEXTURE_BINDING
                    | GPUTextureUsage.RENDER_ATTACHMENT,
            }),
            sampler,
        };

        const data = await createImageBitmap(image);

        device.queue.copyExternalImageToTexture(
            { source: data },
            { texture: texture.texture },
            { width: image.width, height: image.height },
        );

        this._textures.set(path, texture);
    }
}
