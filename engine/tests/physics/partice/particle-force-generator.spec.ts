import { describe, expect, it } from "@jest/globals";

import { IParticlePhysics, ParticleForceGenerator, ParticlePhysics } from "../../../src/physics/particle";
import { IVector2, Vector2 } from "../../../src/math/vector2";

describe("ParticleForceGenerator: Weight force", () => {
    it("should generate downwards weight force", () => {
        const particleWithDownwardsGravity: IParticlePhysics = new ParticlePhysics({
            gravity: new Vector2(0, 10),
            mass: 10,
        });

        const downWardsForce = ParticleForceGenerator.weightForce(particleWithDownwardsGravity);

        expect(downWardsForce).toEqual(new Vector2(0, 100));
    });

    it("should generate upwards weight force", () => {
        const particleWithUpwardsGravity: IParticlePhysics = new ParticlePhysics({
            gravity: new Vector2(0, -10),
            mass: 10,
        });

        const upwardsForce = ParticleForceGenerator.weightForce(particleWithUpwardsGravity);

        expect(upwardsForce).toEqual(new Vector2(0, -100));
    });

    it("should generate rightwards weight force", () => {
        const particleWithRightwardsGravity: IParticlePhysics = new ParticlePhysics({
            gravity: new Vector2(10, 0),
            mass: 10,
        });

        const rightwardsForce = ParticleForceGenerator.weightForce(particleWithRightwardsGravity);

        expect(rightwardsForce).toEqual(new Vector2(100, 0));
    });

    it("should generate leftwards weight force", () => {
        const particleWithLeftwardsGravity: IParticlePhysics = new ParticlePhysics({
            gravity: new Vector2(-10, 0),
        });

        const leftwardsForce = ParticleForceGenerator.weightForce(particleWithLeftwardsGravity);

        expect(leftwardsForce).toEqual(new Vector2(-10, 0));
    });

    it("should vary depending on the mass", () => {
        let force: IVector2;

        const heavyParticle: IParticlePhysics = new ParticlePhysics({
            mass: 100,
        });
        force = ParticleForceGenerator.weightForce(heavyParticle);
        expect(force).toEqual(new Vector2(0, 980.0000000000001));

        const lightParticle: IParticlePhysics = new ParticlePhysics({
            mass: 0.01,
        });
        force = ParticleForceGenerator.weightForce(lightParticle);
        expect(force).toEqual(new Vector2(0, 0.098));
    });
});