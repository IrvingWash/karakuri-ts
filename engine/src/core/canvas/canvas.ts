import { ensureExists } from "../../utils/existence-ensurer";

import type { CanvasSize } from "./canvas-objects";
import { defaultCanvasSize } from "./canvas-constants";
import type { ICanvas } from "./icanvas";

export class Canvas implements ICanvas {
    private _element: HTMLCanvasElement;

    public constructor(size: CanvasSize = defaultCanvasSize) {
        this._element = this._createElement(size);
    }

    public getElement(): HTMLCanvasElement {
        return this._element;
    }

    public getSize(): CanvasSize {
        return {
            width: this._element.width,
            height: this._element.height,
        };
    }

    public getContextGpu(): GPUCanvasContext {
        return ensureExists(
            this._element.getContext("webgpu"),
            "Failed to get WebGPU context",
        );
    }

    private _createElement(size: CanvasSize): HTMLCanvasElement {
        const element = document.createElement("canvas");

        element.id = "karakuri";
        element.width = size.width;
        element.height = size.height;
        element.style.display = "block";

        element.focus();

        document.body.append(element);

        return element;
    }
}
