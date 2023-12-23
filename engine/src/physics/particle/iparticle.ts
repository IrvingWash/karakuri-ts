import { IVector2 } from "../../math/vector2";

export interface IParticle {
    integrate(time: number): void;
    addForce(force: IVector2): void;
    getAccumulatedForce(): IVector2;
    clearForces(): void;
    hasFiniteMass(): boolean;
    getPosition(): IVector2;
    setPosition(position: IVector2): void;
    getVelocity(): IVector2;
    setVelocity(velocity: IVector2): void;
    getAcceleration(): IVector2;
    setAcceleration(acceleration: IVector2): void;
    getInverseMass(): number;
    setInverseMass(inverseMass: number): void;
    getMass(): number;
    setMass(mass: number): void;
}
