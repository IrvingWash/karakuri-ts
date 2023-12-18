export class MockGpuTexture implements GPUTexture {
    public __brand: "GPUTexture";
    public width: number;
    public height: number;
    public depthOrArrayLayers: number;
    public mipLevelCount: number;
    public sampleCount: number;
    public dimension: GPUTextureDimension;
    public format: GPUTextureFormat;
    public usage: number;
    public label: string;

    public constructor(width: number, height: number) {
        this.__brand = "GPUTexture";

        this.width = width;
        this.height = height;
        this.depthOrArrayLayers = 0;
        this.mipLevelCount = 0;
        this.sampleCount = 0;
        this.dimension = "2d";
        this.format = "rgba8uint";
        this.usage = 0;
        this.label = "";
    }

    public createView(): GPUTextureView {
        throw new Error("Method not implemented.");
    }

    public destroy(): undefined {
        throw new Error("Method not implemented.");
    }
}

export class MockGpuSampler implements GPUSampler {
    public __brand: "GPUSampler";
    public label: string;

    public constructor() {
        this.__brand = "GPUSampler";

        this.label = "";
    }
}
