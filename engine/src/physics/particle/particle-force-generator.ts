import { Vector2 } from "../../math/vector2";
import { IParticlePhysics } from "./iparticle-physics";

export class ParticleForceGenerator {
    private constructor() {}

    public static weightForce(particle: IParticlePhysics): Vector2 {
        return particle.getGravity().toScaled(particle.getMass());
    }
}
