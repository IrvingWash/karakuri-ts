import { Vector2, type IVector2 } from "../../math/vector2";
import type { IParticle } from "./iparticle";

export class Particle implements IParticle {
    private _position!: IVector2;
    private _velocity!: IVector2;
    private _acceleration!: IVector2;
    private _inverseMass!: number;

    private _accumulatedForce: IVector2;

    public constructor(position: IVector2, mass?: number) {
        this.setPosition(position);
        this.setVelocity(new Vector2());
        this.setAcceleration(new Vector2());
        this.setMass(mass ?? 1);

        this._accumulatedForce = new Vector2();
    }

    public integrate(time: number): void {
        if (!this.hasFiniteMass() || time <= 0) {
            return;
        }

        this._acceleration = this._accumulatedForce.toScaled(this._inverseMass);
        this._velocity.add(this._acceleration.toScaled(time));
        this._position.add(this._velocity.toScaled(time));

        this.clearForces();
    }

    public addForce(force: IVector2): void {
        this._accumulatedForce.add(force);
    }

    public getAccumulatedForce(): IVector2 {
        return this._accumulatedForce;
    }

    public clearForces(): void {
        this._accumulatedForce = new Vector2();
    }

    public hasFiniteMass(): boolean {
        return this._inverseMass >= 0;
    }

    public getPosition(): IVector2 {
        return this._position;
    }

    public setPosition(position: IVector2): void {
        this._position = position;
    }

    public getVelocity(): IVector2 {
        return this._velocity;
    }

    public setVelocity(velocity: IVector2): void {
        this._velocity = velocity;
    }

    public getAcceleration(): IVector2 {
        return this._acceleration;
    }

    public setAcceleration(acceleration: IVector2): void {
        this._acceleration = acceleration;
    }

    public getInverseMass(): number {
        return this._inverseMass;
    }

    public setInverseMass(inverseMass: number): void {
        this._inverseMass = inverseMass;
    }

    public getMass(): number {
        if (this._inverseMass === 0) {
            return Number.MAX_VALUE;
        }

        return 1 / this._inverseMass;
    }

    public setMass(mass: number): void {
        if (mass === 0) {
            this._inverseMass = -1;

            return;
        }

        this._inverseMass = 1 / mass;
    }
}
