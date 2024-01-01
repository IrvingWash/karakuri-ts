import { IVector2 } from "../../math/vector2";

export interface IParticle {
    addForce(force: IVector2): void;
    integrate(time: number): void;

    getPosition(): IVector2;
    getMass(): number;
}
