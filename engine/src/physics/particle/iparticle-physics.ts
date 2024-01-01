import { IVector2 } from "../../math/vector2";

export interface IParticlePhysics {
    addForce(force: IVector2): void;
    integrate(time: number): void;

    getPosition(): IVector2;
    getMass(): number;
    getGravity(): IVector2;
}
