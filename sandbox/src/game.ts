import {
    Karakuri,
    Vector2,
    Sprite,
    Transform,
    Particle,
    Behavior,
    ParticleForceGenerator,
} from "karakuri";

import circle from "../assets/circle.png";

const PIXELS_PER_METER = 50;

class Sun extends Behavior {}

class Earth extends Behavior {
    public override onUpdate(_deltaTime: number): void {
        const sun = this.getEntity("sun");
        const p = this.particle?.getParticlePhysics();

        if (p === undefined || sun === undefined) {
            return;
        }

        const force = ParticleForceGenerator.gravitationForce(
            p,
            sun.particle?.getParticlePhysics()!,
            PIXELS_PER_METER * 10,
            10, 100,
        );

        p.addForce(force);
    }
}

export async function game(): Promise<void> {
    const engine = new Karakuri({ clearColor: [0.7, 0.7, 0.7, 1] });
    await engine.init();

    const level = engine.createScene();
    const canvasSize = engine.getCanvasSize();

    await level.createEntity({
        name: "sun",
        transform: new Transform({
            position: new Vector2(canvasSize.width / 2 - 150, canvasSize.height / 2 - 150),
            scale: new Vector2(3, 3),
        }),
        behavior: new Sun(),
        particle: new Particle({
            gravity: new Vector2(0, 0),
            mass: 1000,
        }),
        sprite: new Sprite({
            path: circle,
            color: [1, 0.5, 0, 1],
        }),
    });

    await level.createEntity({
        name: "earth",
        transform: new Transform({
            position: new Vector2(canvasSize.width / 2 - 200, canvasSize.height / 2 - 200),
            scale: new Vector2(0.5, 0.5),
        }),
        behavior: new Earth(),
        particle: new Particle({
            gravity: new Vector2(0, 0),
            mass: 1,
        }),
        sprite: new Sprite({
            path: circle,
            color: [0, 0.5, 1, 1],
        }),
    });

    level.start();
}
