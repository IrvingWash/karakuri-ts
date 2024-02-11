import { describe, expect, it } from "@jest/globals";

import { Particle, ParticleForceGenerator } from "../../../src/physics/particle";
import { Vector2 } from "../../../src/math/vector2";

describe("ParticleForceGenerator", () => {
    it("should generate weight force", () => {
        const particle = new Particle({ position: new Vector2(10, 10), mass: 3 });

        const weightForce = ParticleForceGenerator.weightForce(particle, new Vector2(0, 9.8 * 50));

        expect(weightForce).toEqual(new Vector2(0, 1470.0000000000002));

        particle.setMass(0);

        const weightForceForZeroMass = ParticleForceGenerator.weightForce(particle, new Vector2(100, 100));

        expect(weightForceForZeroMass).toEqual(new Vector2());
    });

    it("should generate drag force", () => {
        const particle = new Particle({
            position: new Vector2(10, 10),
            mass: 3,
            velocity: new Vector2(10, 10),
        });

        const dragForce = ParticleForceGenerator.dragForce(particle, 0.1);

        expect(dragForce).toEqual(new Vector2(-14.14213562373095, -14.14213562373095));
    });

    it("should generate friction force", () => {
        const particle = new Particle({
            position: new Vector2(10, 10),
            mass: 3,
            velocity: new Vector2(10, 10),
        });

        const frictionForce = ParticleForceGenerator.frictionForce(particle, 2);

        expect(frictionForce).toEqual(new Vector2(-1.414213562373095, -1.414213562373095));
    });

    it("should generate gravitational force", () => {
        const particle = new Particle({
            position: new Vector2(10, 10),
            mass: 3,
            velocity: new Vector2(10, 10),
        });

        const other = new Particle({
            position: new Vector2(30, 30),
            mass: 100,
        });

        const gravitationalForce = ParticleForceGenerator.gravitationalForce(particle, other, 500, 10, 50);

        expect(gravitationalForce).toEqual(new Vector2(2121.3203435596424, 2121.3203435596424));
    });
});
