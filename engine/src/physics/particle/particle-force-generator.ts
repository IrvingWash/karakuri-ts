import { type IVector2, Vector2 } from "../../math/vector2";
import { type IParticlePhysics } from "./iparticle-physics";

export class ParticleForceGenerator {
    private constructor() {}

    public static weightForce(particle: IParticlePhysics): Vector2 {
        const mass = particle.getMass();

        if (mass === 0) {
            return new Vector2();
        }

        return particle.getGravity().toScaled(mass);
    }

    public static dragForce(particle: IParticlePhysics, constant: number): IVector2 {
        if (particle.getMass() === 0) {
            return new Vector2();
        }

        const velocitySquaredMagnitude = particle.getVelocity().getSquaredMagnitude();

        if (velocitySquaredMagnitude <= 0) {
            return new Vector2();
        }

        const dragDirection = particle.getVelocity().toNormalized().scale(-1);
        const dragMagnitude = constant * velocitySquaredMagnitude;

        return dragDirection.scale(dragMagnitude);
    }

    public static frictionForce(particle: IParticlePhysics, constant: number): IVector2 {
        if (particle.getMass() === 0) {
            return new Vector2();
        }

        const frictionDirection = particle.getVelocity().toNormalized().scale(-1);

        return frictionDirection.scale(constant);
    }
}
