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
});
