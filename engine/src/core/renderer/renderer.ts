import { CanvasSize } from "../canvas";

export class Renderer {
    private _canvasSize: CanvasSize;
    private _ctx: GPUCanvasContext;
    private _device!: GPUDevice;

    public constructor(canvasSize: CanvasSize, ctx: GPUCanvasContext) {
        this._canvasSize = canvasSize;
        this._ctx = ctx;
    }

    public async init(): Promise<void> {
        const adapter = await navigator.gpu.requestAdapter();
        const device = await adapter?.requestDevice({ label: "Rendering device" });

        if (device === undefined) {
            throw new Error("Failed to request GPU device");
        }

        this._device = device;

        this._ctx.configure({
            device,
            format: navigator.gpu.getPreferredCanvasFormat(),
        });
    }

    public test(): void {
        console.log(this._canvasSize);
        console.log(this._device);
    }
}
