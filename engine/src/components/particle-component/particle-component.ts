import type { IParticleComponent } from "./iparticle-component";
import { Particle, type IParticle } from "../../physics/particle";
import type { IVector2 } from "../../math/vector2";

export class ParticleComponent implements IParticleComponent {
    private _initialMass?: number;
    private _particle!: IParticle;

    public constructor(mass?: number) {
        this._initialMass = mass;
    }

    public __init(position: IVector2): void {
        this._particle = new Particle({
            mass: this._initialMass,
            position: position,
        });
    }

    public addForce(value: IVector2): void {
        this._particle.addForce(value);
    }
}
