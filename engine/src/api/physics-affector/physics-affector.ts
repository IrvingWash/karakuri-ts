import { IEntity } from "../../core/objects";
import { ParticleForceGenerator } from "../../physics/particle";
import { IPhysicsAffector } from "./iphysics-affector";

export class PhysicsAffector implements IPhysicsAffector {
    public affect(entity: IEntity, time: number): void {
        if (entity.particle === undefined) {
            return;
        }

        ParticleForceGenerator.weightForce(entity.particle.getParticlePhysics());

        entity.particle.getParticlePhysics().integrate(time);
    }
}
