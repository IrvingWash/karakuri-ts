import { IVector2 } from "../../math/vector2";

export interface IParticleComponent {
    __init(position: IVector2): void;
    addForce(value: IVector2): void;
}
