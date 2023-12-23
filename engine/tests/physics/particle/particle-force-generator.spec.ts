import { beforeEach, describe, expect, it } from "@jest/globals";
import { type IParticle, Particle, ParticleForceGenerator } from "../../../src/physics/particle";
import { Vector2 } from "../../../src/math/vector2";

describe("ParticleForceGenerator", () => {
    const zeroVector = new Vector2();

    beforeEach(() => {
        expect(zeroVector).toEqual(new Vector2(0, 0));
    });

    it("should apply gravity to particles with finite mass", () => {
        const particle: IParticle = new Particle(zeroVector.clone());

        const force = new Vector2(0, 10);

        ParticleForceGenerator.gravity(particle, force);

        particle.integrate(1);

        expect(particle.getPosition()).toEqual(new Vector2(0, 10));
        expect(particle.getAcceleration()).toEqual(new Vector2(0, 10));
        expect(particle.getInverseMass()).toEqual(1);
        expect(particle.getMass()).toEqual(1);
        expect(particle.getVelocity()).toEqual(new Vector2(0, 10));
        expect(force).toEqual(new Vector2(0, 10));
    });

    it("should ignore particles with infinite mass", () => {
        const particle: IParticle = new Particle(zeroVector.clone(), 0);

        const force = new Vector2(0, 10);

        ParticleForceGenerator.gravity(particle, force);

        particle.integrate(1);

        expect(particle.getPosition()).toEqual(zeroVector);
        expect(particle.getAcceleration()).toEqual(zeroVector);
        expect(particle.getInverseMass()).toEqual(-1);
        expect(particle.getMass()).toEqual(-1);
        expect(particle.getVelocity()).toEqual(new Vector2(0, 0));
    });
});
