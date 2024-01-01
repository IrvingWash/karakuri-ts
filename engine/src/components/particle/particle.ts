import { type IVector2 } from "../../math/vector2";
import { ParticlePhysics, type IParticlePhysics } from "../../physics/particle";
import { type IParticle } from "./iparticle";

export class Particle implements IParticle {
    private _particlePhysics: IParticlePhysics | null = null;

    private readonly _mass: number;

    public constructor(mass?: number) {
        this._mass = mass ?? 0;
    }

    public __init(position: IVector2): void {
        this._particlePhysics = new ParticlePhysics({
            mass: this._mass,
            position: position,
        });
    }

    public getParticlePhysics(): IParticlePhysics {
        if (this._particlePhysics === null) {
            throw new Error("Particle is not initialized");
        }

        return this._particlePhysics;
    }
}
