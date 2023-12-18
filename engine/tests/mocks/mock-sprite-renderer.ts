import { Texture } from "../../src/core/sprite-renderer";
import { MockGpuSampler, MockGpuTexture } from "./gpu-mocks";

export interface MockTexture extends Texture {
    id: string;
    texture: MockGpuTexture;
    sampler: MockGpuSampler;
}
