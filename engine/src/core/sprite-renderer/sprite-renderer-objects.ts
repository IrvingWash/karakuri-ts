import type { IAssetStorage } from "../asset-storage";
import type { RGBA } from "../objects";

export interface Texture {
    id: string;
    texture: GPUTexture;
    sampler: GPUSampler;
}

export interface SpritePipeline {
    pipeline: GPURenderPipeline;
    textureBindGroup: GPUBindGroup;
}

export interface Clip {
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface ISprite {
    readonly color: RGBA;
    readonly clip: Clip;
    readonly texture: Texture;

    __init(assetStorage: IAssetStorage): Promise<void>;
}
