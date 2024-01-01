import { IEntity } from "../../core/objects";
import { ParticleForceGenerator } from "../../physics/particle";
import { IPhysicsAffector } from "./iphysics-affector";

export class PhysicsAffector implements IPhysicsAffector {
    public affect(entity: IEntity, time: number): void {
        if (entity.particle === undefined) {
            return;
        }

        const particlePhysics = entity.particle.getParticlePhysics();

        const force = ParticleForceGenerator.weightForce(particlePhysics);

        particlePhysics.addForce(force);

        particlePhysics.integrate(time);
    }
}
