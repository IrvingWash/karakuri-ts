import { IScene } from "../scene";

export interface IKarakuri {
    init(): Promise<void>;
    createScene(): IScene;
}
