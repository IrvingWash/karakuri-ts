import { Vector2, type IVector2 } from "../../math/vector2";
import { IParticlePhysics } from "./iparticle-physics";
import { defaultGravity, defaultMass } from "./particle-constants";

interface ParticlePhysicsParams {
    position?: IVector2;
    velocity?: IVector2;
    mass?: number;
    gravity?: IVector2;
}

export class ParticlePhysics implements IParticlePhysics {
    private _position: IVector2;
    private _velocity: IVector2;
    private _mass: number;
    private _inverseMass: number;
    private _gravity: IVector2;

    private _accumulatedForce: IVector2;

    public constructor(params: ParticlePhysicsParams) {
        this._position = params.position ?? new Vector2();
        this._velocity = params.velocity ?? new Vector2();
        this._mass = params.mass ?? defaultMass;
        this._gravity = params.gravity ?? defaultGravity.clone();
        this._inverseMass = this._calculateInverseMass(this._mass);

        this._accumulatedForce = new Vector2();
    }

    public integrate(time: number): void {
        const acceleration = this._accumulatedForce.scale(this._inverseMass);

        this._velocity.add(acceleration.scale(time));

        this._position.add(this._velocity.toScaled(time));

        this._clearForces();
    }

    public addForce(force: IVector2): void {
        this._accumulatedForce.add(force);
    }

    public getPosition(): IVector2 {
        return this._position;
    }

    public getMass(): number {
        return this._mass;
    }

    public getGravity(): IVector2 {
        return this._gravity;
    }

    private _clearForces(): void {
        this._accumulatedForce.reset();
    }

    private _calculateInverseMass(mass: number): number {
        return mass === 0 ? 0 : 1 / mass;
    }
}
