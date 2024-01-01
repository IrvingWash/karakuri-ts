import { IVector2, Vector2 } from "../../math/vector2";
import { IParticlePhysics } from "./iparticle-physics";

export class ParticleForceGenerator {
    private constructor() {}

    public static weightForce(particle: IParticlePhysics): Vector2 {
        return particle.getGravity().toScaled(particle.getMass());
    }

    public static dragForce(particle: IParticlePhysics, constant: number): IVector2 {
        const velocitySquaredMagnitude = particle.getVelocity().getSquaredMagnitude();

        if (velocitySquaredMagnitude <= 0) {
            return new Vector2();
        }

        const dragDirection = particle.getVelocity().toNormalized().scale(-1);
        const dragMagnitude = constant * velocitySquaredMagnitude;

        return dragDirection.scale(dragMagnitude);
    }
}
