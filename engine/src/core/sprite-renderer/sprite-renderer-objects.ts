export interface DrawData {
    vertices: number[];
    texture: Texture;
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
