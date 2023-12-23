import { expect, describe, it, afterEach } from "@jest/globals";

import { Particle, type IParticle } from "../../../src/physics/particle";
import { Vector2 } from "../../../src/math/vector2";

describe("Particle", () => {
    const zeroVector = new Vector2();

    afterEach(() => {
        expect(zeroVector).toEqual(new Vector2());
    });

    it("should be instantiated with default values", () => {
        const position = new Vector2(34, -0.53);

        const particle: IParticle = new Particle(position);

        expect(particle.getAcceleration()).toEqual(zeroVector);
        expect(particle.getInverseMass()).toEqual(1);
        expect(particle.getMass()).toEqual(1);
        expect(particle.getPosition()).toBe(position);
        expect(particle.getVelocity()).toEqual(zeroVector);
    });

    it("should integrate particle with finite mass", () => {
        const mass = 50;

        const particle: IParticle = new Particle(new Vector2(500, -500), mass);

        particle.setVelocity(new Vector2(0, 30));
        particle.setAcceleration(new Vector2(0, 1));

        particle.addForce(new Vector2(30, -3));
        particle.addForce(new Vector2(0, 10));

        particle.integrate(0.5);

        expect(particle.getAcceleration()).toEqual(new Vector2(0.6, 0.14));
        expect(particle.getAccumulatedForce()).toEqual(zeroVector);
        expect(particle.getInverseMass()).toEqual(1 / mass);
        expect(particle.getMass()).toEqual(mass);
        expect(particle.getPosition()).toEqual(new Vector2(500.15, -484.965));
        expect(particle.getVelocity()).toEqual(new Vector2(0.3, 30.07));
    });

    it("should not integrate paticle with infinite mass", () => {
        const mass = -1;

        const particle: IParticle = new Particle(new Vector2(3, 5), mass);

        particle.addForce(new Vector2(30, -3));
        particle.addForce(new Vector2(0, 10));

        particle.integrate(5);

        expect(particle.getAcceleration()).toEqual(zeroVector);
        expect(particle.getAccumulatedForce()).toEqual(new Vector2(30, 7));
        expect(particle.getInverseMass()).toEqual(mass);
        expect(particle.getMass()).toEqual(mass);
        expect(particle.getPosition()).toEqual(new Vector2(3, 5));
        expect(particle.getVelocity()).toEqual(zeroVector);
    });

    it("should add force to accumulator", () => {
        const particle: IParticle = new Particle(zeroVector);

        const firstForce = new Vector2(1, 1);
        const secondForce = new Vector2(-1, 0);

        particle.addForce(firstForce);

        expect(particle.getAccumulatedForce()).toEqual(firstForce);
        expect(particle.getAccumulatedForce()).not.toBe(firstForce);

        particle.addForce(secondForce);

        expect(particle.getAccumulatedForce()).toEqual(firstForce.toAdded(secondForce));
    });

    it("should clear all accumulated force", () => {
        const particle: IParticle = new Particle(zeroVector);

        particle.addForce(new Vector2(999, -900));
        particle.addForce(new Vector2(9.99, -0.9));

        particle.clearForces();

        expect(particle.getAccumulatedForce()).toEqual(zeroVector);
    });

    it("should check if it has finite mass", () => {
        const particle: IParticle = new Particle(zeroVector);
        expect(particle.hasFiniteMass()).toEqual(true);

        particle.setMass(1);
        expect(particle.hasFiniteMass()).toEqual(true);

        particle.setMass(-1);
        expect(particle.hasFiniteMass()).toEqual(false);

        particle.setInverseMass(1 / 50);
        expect(particle.hasFiniteMass()).toEqual(true);

        particle.setInverseMass(1 / -50);
        expect(particle.hasFiniteMass()).toEqual(false);

        particle.setInverseMass(0);
        expect(particle.hasFiniteMass()).toEqual(true);
    });

    it("should have infinite mass when instantiating with zero mass", () => {
        expect(new Particle(zeroVector, 0).hasFiniteMass()).toEqual(false);
    });

    it("should correctly set the given mass when instantiating", () => {
        const particle1: IParticle = new Particle(zeroVector, 35);

        expect(particle1.getMass()).toEqual(35);
        expect(particle1.getInverseMass()).toEqual(1 / 35);

        const particle2: IParticle = new Particle(zeroVector, -35);

        expect(particle2.getMass()).toEqual(-35);
        expect(particle2.getInverseMass()).toEqual(1 / -35);
    });

    it("should set the given acceleration", () => {
        const particle: IParticle = new Particle(zeroVector);

        const acceleration = new Vector2(-3.3, 5.23);

        particle.setAcceleration(acceleration);

        expect(particle.getAcceleration()).toBe(acceleration);
    });

    it("should set the given inverse mass", () => {
        const particle: IParticle = new Particle(zeroVector, 55);

        const inverseMass = 1 / 3;

        particle.setInverseMass(inverseMass);

        expect(particle.getInverseMass()).toEqual(inverseMass);
        expect(particle.getMass()).toEqual(1 / inverseMass);

        particle.setInverseMass(-inverseMass);

        expect(particle.getInverseMass()).toEqual(-inverseMass);
        expect(particle.getMass()).toEqual(1 / -inverseMass);

        particle.setInverseMass(0);

        expect(particle.getInverseMass()).toEqual(0);
        expect(particle.getMass()).toEqual(1.7976931348623157e+308);
    });

    it("should set the given mass", () => {
        const particle: IParticle = new Particle(zeroVector, 55);

        const mass = 3;

        particle.setMass(mass);
        expect(particle.getInverseMass()).toEqual(1 / mass);
        expect(particle.getMass()).toEqual(mass);

        particle.setMass(-mass);
        expect(particle.getInverseMass()).toEqual(1 / -mass);
        expect(particle.getMass()).toEqual(-mass);

        particle.setMass(0);
        expect(particle.getInverseMass()).toEqual(-1);
        expect(particle.getMass()).toEqual(-1);
    });

    it("should set the given position", () => {
        const particle: IParticle = new Particle(zeroVector);

        const position = new Vector2(3.034, -1);

        particle.setPosition(position);

        expect(particle.getPosition()).toEqual(position);
    });

    it("should set the given velocity", () => {
        const particle: IParticle = new Particle(zeroVector);

        const velocity = new Vector2(5, 0);

        particle.setVelocity(velocity);

        expect(particle.getVelocity()).toEqual(velocity);
    });
});
