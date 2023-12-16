import { SpritePipeline } from "./sprite-renderer-objects";

export class BatchDrawCall {
    public pipeline: SpritePipeline;
    public vertexData: Float32Array;

    private _instanceCount: number;

    public constructor(pipeline: SpritePipeline, maxSpriteCount: number, attributesBerSprite: number) {
        this.pipeline = pipeline;
        this.vertexData = new Float32Array(maxSpriteCount * attributesBerSprite);
        this._instanceCount = 0;
    }

    public incrementInstanceCount(): void {
        this._instanceCount++;
    }

    public getInstanceCount(): number {
        return this._instanceCount;
    }
}
