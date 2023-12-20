import { RGBA } from "../objects";

export interface DrawData {
    vertices: number[];
    texture: Texture;
    clip: Clip;
    color: RGBA;
}

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
