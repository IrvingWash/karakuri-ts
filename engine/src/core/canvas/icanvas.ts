import { CanvasSize } from "./canvas-objects";

export interface ICanvas {
    getElement(): HTMLCanvasElement;
    getSize(): CanvasSize;
    getContextGpu(): GPUCanvasContext;
}
