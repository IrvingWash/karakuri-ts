import { IVector2 } from "../../math/vector2";
import { IParticlePhysics } from "../../physics/particle";

export interface IParticle {
    __init(position: IVector2): void;
    getParticlePhysics(): IParticlePhysics;
}
