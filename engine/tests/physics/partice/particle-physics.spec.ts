import { describe, expect, it } from "@jest/globals";

import { IParticlePhysics, ParticlePhysics } from "../../../src/physics/particle";
import { defaultGravity, defaultMass } from "../../../src/physics/particle/particle-constants";
import { Vector2 } from "../../../src/math/vector2";

describe("ParticlePhysics", () => {
    it("should instantiate with defaults", () => {
        const pp: IParticlePhysics = new ParticlePhysics({});

        expect(pp.getGravity()).toEqual(defaultGravity);
        expect(pp.getMass()).toEqual(defaultMass);
        expect(pp.getPosition()).toEqual(new Vector2());
    });

    it("should instantiate with the passed params", () => {
        const gravity = new Vector2(-10, 5);
        const mass = 0;
        const position = new Vector2(30, 30);
        const velocity = new Vector2(3, 3);

        const pp: IParticlePhysics = new ParticlePhysics({
            gravity,
            mass,
            position,
            velocity,
        });

        expect(pp.getGravity()).toBe(gravity);
        expect(pp.getMass()).toEqual(mass);
        expect(pp.getPosition()).toBe(position);
    });

    it("should integrate", () => {
        const gravity = new Vector2(-10, 5);
        const mass = 1;
        const position = new Vector2(30, 30);

        const pp: IParticlePhysics = new ParticlePhysics({
            gravity,
            mass,
            position,
        });

        const previousPosition = pp.getPosition().clone();
        pp.integrate(0.5);
        expect(pp.getPosition()).toEqual(previousPosition);

        pp.addForce(new Vector2(-30, 5));
        pp.addForce(new Vector2(1, -1));
        pp.integrate(0.5);
        expect(pp.getPosition()).toEqual(new Vector2(22.75, 31));
    });
});
