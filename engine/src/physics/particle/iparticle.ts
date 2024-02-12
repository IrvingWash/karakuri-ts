import { IVector2 } from "../../math/vector2";

export interface IParticle {
    integrate(time: number): void;
    addForce(value: IVector2): void;
    getPosition(): IVector2;
    getVelocity(): IVector2;
    getMass(): number;
    getInverseMass(): number;
    setPosition(value: IVector2): void;
    setVelocity(value: IVector2): void;
    setMass(value: number): void;
};
