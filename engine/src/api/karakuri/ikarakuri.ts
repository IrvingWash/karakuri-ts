import { CanvasSize } from "../../core/canvas";
import { IScene } from "../scene";

export interface IKarakuri {
    init(): Promise<void>;
    getSize(): CanvasSize;
    createScene(): IScene;
}
