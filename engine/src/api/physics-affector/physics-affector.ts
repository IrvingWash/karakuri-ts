import { IEntity } from "../../core/objects";
import { IParticlePhysics, ParticleForceGenerator } from "../../physics/particle";
import { IPhysicsAffector } from "./iphysics-affector";

export class PhysicsAffector implements IPhysicsAffector {
    public affect(entity: IEntity, time: number): void {
        if (entity.particle === undefined) {
            return;
        }

        const particlePhysics = entity.particle.getParticlePhysics();

        this._addDefaultForces(particlePhysics);

        particlePhysics.integrate(time);
    }

    private _addDefaultForces(particlePhysics: IParticlePhysics): void {
        particlePhysics.addForce(ParticleForceGenerator.weightForce(particlePhysics));
    }
}
