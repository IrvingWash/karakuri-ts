import { describe, expect, it } from "@jest/globals";

import { Particle, type IParticle } from "../../../src/physics/particle";
import { Vector2 } from "../../../src/math/vector2";

const position = new Vector2(10, 20);
const mass = 3;
const velocity = new Vector2(1, 3);

describe("Particle", () => {
    it("should be constructed", () => {
        const particle: IParticle = new Particle({
            position,
            mass: 3,
            velocity,
        });

        expect(particle.getPosition()).toEqual(position);
        expect(particle.getMass()).toEqual(mass);
        expect(particle.getInverseMass()).toEqual(1 / mass);
        expect(particle.getVelocity()).toEqual(velocity);

        const defaultParticle: IParticle = new Particle({});

        expect(defaultParticle.getPosition()).toEqual(new Vector2());
        expect(defaultParticle.getMass()).toEqual(1);
        expect(defaultParticle.getInverseMass()).toEqual(1);
        expect(defaultParticle.getVelocity()).toEqual(new Vector2());
    });

    it("should integrate", () => {
        const particle: IParticle = new Particle({
            position: new Vector2(100, 100),
            mass: 5,
        });

        const force = new Vector2(3, 5);

        particle.addForce(force);
        particle.addForce(new Vector2(force.x, -force.y / 2));

        particle.integrate(0.5);

        expect(particle.getPosition()).toEqual(new Vector2(100.3, 100.125));
        expect(particle.getVelocity()).toEqual(new Vector2(0.6000000000000001, 0.25));
    });

    it("should not integrate if mass is 0", () => {
        const particle: IParticle = new Particle({
            position,
            velocity,
            mass: 0,
        });

        const force = new Vector2(3, 5);

        particle.addForce(force);
        particle.addForce(new Vector2(force.x, -force.y / 2));

        particle.integrate(5);

        expect(particle.getPosition()).toEqual(position);
        expect(particle.getVelocity()).toEqual(velocity);
    });

    it("should get and set position", () => {
        const particle: IParticle = new Particle({});

        particle.setPosition(position);
        expect(particle.getPosition()).toEqual(position);
    });

    it("should get  and set velocity", () => {
        const particle: IParticle = new Particle({});

        particle.setVelocity(velocity);
        expect(particle.getVelocity()).toEqual(velocity);
    });

    it("should get and set mass", () => {
        const particle: IParticle = new Particle({});

        particle.setMass(mass);
        expect(particle.getMass()).toEqual(mass);
        expect(particle.getInverseMass()).toEqual(1 / mass);
    });

    it("should resolve mass and inverse mass invariant", () => {
        const particle: IParticle = new Particle({ mass: 0 });

        expect(particle.getMass()).toEqual(0);
        expect(particle.getInverseMass()).toEqual(0);

        const newMass = 7;

        particle.setMass(newMass);
        expect(particle.getMass()).toEqual(newMass);
        expect(particle.getInverseMass()).toEqual(1 / newMass);
    });
});
