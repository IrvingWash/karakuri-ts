import { beforeEach, describe, expect, it } from "@jest/globals";
import { type IParticle, Particle, ParticleForceGenerator } from "../../../src/physics/particle";
import { Vector2 } from "../../../src/math/vector2";

const zeroVector = new Vector2();

describe("ParticleForceGenerator: Gravity", () => {
    beforeEach(() => {
        expect(zeroVector).toEqual(new Vector2(0, 0));
    });

    it("should apply force to particles with finite mass", () => {
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

describe("ParticleForceGenerator: Drag", () => {
    beforeEach(() => {
        expect(zeroVector).toEqual(new Vector2(0, 0));
    });

    it("should ignore particles with infinite mass", () => {
        const particle: IParticle = new Particle(zeroVector.clone(), 0);

        ParticleForceGenerator.drag(particle, 0.003);

        particle.integrate(1);

        expect(particle.getPosition()).toEqual(zeroVector);
        expect(particle.getAcceleration()).toEqual(zeroVector);
        expect(particle.getInverseMass()).toEqual(-1);
        expect(particle.getMass()).toEqual(-1);
        expect(particle.getVelocity()).toEqual(new Vector2(0, 0));
    });

    it("should apply force to particles with finite mass", () => {
        const particle: IParticle = new Particle(zeroVector.clone());

        ParticleForceGenerator.gravity(particle, new Vector2(0, 10));
        ParticleForceGenerator.drag(particle, 0.003);

        particle.integrate(1);

        expect(particle.getPosition()).toEqual(new Vector2(0, 10));
        expect(particle.getAcceleration()).toEqual(new Vector2(0, 10));
        expect(particle.getInverseMass()).toEqual(1);
        expect(particle.getMass()).toEqual(1);
        expect(particle.getVelocity()).toEqual(new Vector2(0, 10));
    });
});

describe("ParticleForceGenerator: Anchored Spring", () => {
    it("", () => {
        const particle: IParticle = new Particle(new Vector2(10, 10), 5);
        const anchor: IParticle = new Particle(zeroVector.clone());

        ParticleForceGenerator.anchoredSpring(particle, anchor.getPosition(), 5, 300);
        ParticleForceGenerator.gravity(particle, new Vector2(0, 500));

        particle.integrate(1);
        anchor.integrate(1);

        expect(particle.getPosition()).toEqual(new Vector2(
            212.13203435596424,
            712.1320343559643,
        ));
        expect(anchor.getPosition()).toEqual(zeroVector);
    });
});

describe("ParticleForceGenerator: Spring", () => {
    it("", () => {
        const particle: IParticle = new Particle(new Vector2(10, 10), 5);
        const anchor: IParticle = new Particle(zeroVector.clone());

        ParticleForceGenerator.spring(particle, anchor, 5, 300);
        ParticleForceGenerator.gravity(particle, new Vector2(0, 500));

        particle.integrate(1);
        anchor.integrate(1);

        expect(particle.getPosition()).toEqual(new Vector2(
            212.13203435596424,
            712.1320343559643,
        ));
        expect(anchor.getPosition()).toEqual(zeroVector);
    });
});
