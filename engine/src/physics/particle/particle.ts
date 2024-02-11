import { type IVector2, Vector2 } from "../../math/vector2";
import { IParticle } from "./iparticle";

interface ParticleParams {
    position?: Vector2,
    velocity?: Vector2,
    mass?: number;
}

export class Particle implements IParticle {
    private _position: IVector2;
    private _velocity: IVector2;
    private _inverseMass: number;
    private _mass: number;
    private _accumulatedForce: IVector2;

    public constructor(params: ParticleParams) {
        this._position = params.position ?? new Vector2();
        this._velocity = params.velocity ?? new Vector2();
        this._mass = params.mass ?? 1;
        this._inverseMass = this._calculateInverseMass();
        this._accumulatedForce = new Vector2();
    }

    public integrate(time: number): void {
        if (this._mass === 0) {
            return;
        }

        const acceleration = this._accumulatedForce.scale(this._inverseMass);

        this._velocity.add(acceleration.scale(time));

        this._position.add(this._velocity.scale(time));

        this._clearForce();
    }

    public addForce(value: IVector2): void {
        this._accumulatedForce.add(value);
    }

    public getPosition(): Vector2 {
        return this._position;
    }

    public getVelocity(): Vector2 {
        return this._velocity;
    }

    public getMass(): number {
        return this._mass;
    }

    public getInverseMass(): number {
        return this._inverseMass;
    }

    public setPosition(value: IVector2): void {
        this._position = value;
    }

    public setVelocity(value: IVector2): void {
        this._velocity = value;
    }

    public setMass(value: number): void {
        this._mass = value;
        this._inverseMass = this._calculateInverseMass();
    }

    private _calculateInverseMass(): number {
        if (this._mass === 0) {
            return 0;
        }

        return 1 / this._mass;
    }

    private _clearForce(): void {
        this._accumulatedForce.reset();
    }
}
