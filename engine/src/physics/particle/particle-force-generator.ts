import { Vector2 } from "../../math/vector2";
import { IParticlePhysics } from "./iparticle-physics";

export class ParticleForceGenerator {
    private constructor() {}

    public static weightForce(particle: IParticlePhysics): void {
        particle.addForce(new Vector2(0, particle.getMass() * particle.getGravity()));
    }
}
