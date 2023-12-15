import { CanvasSize } from "../../core/canvas";
import { RGBA } from "../../core/objects";

export interface EngineConfiguration {
    canvasSize?: CanvasSize;
    clearColor?: RGBA;
}
