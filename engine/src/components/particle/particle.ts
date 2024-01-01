import { type IVector2 } from "../../math/vector2";
import { ParticlePhysics, type IParticlePhysics } from "../../physics/particle";
import { type IParticle } from "./iparticle";

interface ParticleParams {
    mass?: number;
    gravity?: IVector2;
}

export class Particle implements IParticle {
    private _particlePhysics: IParticlePhysics | null = null;

    private readonly _mass?: number;
    private readonly _gravity?: IVector2;

    public constructor(params: ParticleParams) {
        this._mass = params.mass;
        this._gravity = params.gravity;
    }

    public __init(position: IVector2): void {
        this._particlePhysics = new ParticlePhysics({
            mass: this._mass,
            position: position,
            gravity: this._gravity,
        });
    }

    public getParticlePhysics(): IParticlePhysics {
        if (this._particlePhysics === null) {
            throw new Error("Particle is not initialized");
        }

        return this._particlePhysics;
    }
}
