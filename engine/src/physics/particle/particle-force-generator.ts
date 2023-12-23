import { IVector2 } from "../../math/vector2";
import type { IParticle } from "./iparticle";

export class ParticleForceGenerator {
    private constructor() {}

    public static gravity(particle: IParticle, force: IVector2): void {
        if (!particle.hasFiniteMass()) {
            return;
        }

        particle.addForce(force.toScaled(particle.getMass()));
    }

    public static drag(particle: IParticle, force: number): void {
        if (!particle.hasFiniteMass()) {
            return;
        }

        const squaredMagnitude = particle.getVelocity().getSquaredMagnitude();

        if (squaredMagnitude <= 0) {
            return;
        }

        const dragDirection = particle.getVelocity().toNormalized().scale(-1);

        const dragMagnitude = force * squaredMagnitude;

        particle.addForce(dragDirection.scale(dragMagnitude));
    }
}
