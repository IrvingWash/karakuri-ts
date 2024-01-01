import { Vector2 } from "../../math/vector2";
import { IParticlePhysics } from "./iparticle";

export class ParticleForceGenerator {
    private constructor() {}

    public static weightForce(particle: IParticlePhysics, gravity: number): void {
        particle.addForce(new Vector2(0, particle.getMass() * gravity));
    }
}
