import { describe, expect, it } from "@jest/globals";

import { IEntity } from "../../../src/core/objects";
import { Entity } from "../../../src/api/entity";
import { Particle } from "../../../src/components/particle";
import { Vector2 } from "../../../src/math/vector2";
import { IPhysicsAffector, PhysicsAffector } from "../../../src/api/physics-affector";
import { Input } from "../../../src/core/input";
import { MockAssetStorage } from "../../mocks/mock-asset-storage";
import { mockEntityGetter } from "../../mocks/mock-entity-getter";

describe("PhysicsAffector", () => {
    it("should affect with gravity", async() => {
        const entity: IEntity = new Entity({
            name: "entity",
            particle: new Particle({
                gravity: new Vector2(0, 10),
                mass: 10,
            }),
        });

        await entity.__init(new Input(), new MockAssetStorage(), mockEntityGetter);

        const physicsAffector: IPhysicsAffector = new PhysicsAffector();

        physicsAffector.affect(entity, 1);

        expect(entity.transform.position).toEqual(new Vector2(0, 10));
    });
});
