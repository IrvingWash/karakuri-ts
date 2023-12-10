import { ICanvas } from "../canvas";

export class Renderer {
    private _canvas: ICanvas;
    private _ctx: GPUCanvasContext;
    private _device!: GPUDevice;

    public constructor(canvas: ICanvas) {
        this._canvas = canvas;
        this._ctx = canvas.getContextGpu();
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
        console.log(this._canvas);
        console.log(this._device);
    }
}
