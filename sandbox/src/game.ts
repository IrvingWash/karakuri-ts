import {
    Karakuri,
    Vector2,
    Sprite,
    Transform,
    Particle,
    Behavior,
    ParticleForceGenerator,
    IEntity,
} from "karakuri";

import circle from "../assets/circle.png";

const PIXELS_PER_METER = 50;

class Sun extends Behavior {}

class Earth extends Behavior {
    private _sun: IEntity;

    public constructor(sun: IEntity) {
        super();

        this._sun = sun;
    }

    public override onUpdate(_deltaTime: number): void {
        const p = this.particle?.getParticlePhysics();

        if (p === undefined) {
            return;
        }

        const force = ParticleForceGenerator.gravitationForce(p, this._sun.particle?.getParticlePhysics()!, PIXELS_PER_METER * 10, 10, 100);

        p.addForce(force);
    }
}

export async function game(): Promise<void> {
    const engine = new Karakuri({ clearColor: [0.7, 0.7, 0.7, 1] });
    await engine.init();

    const level = engine.createScene();
    const canvasSize = engine.getCanvasSize();

    const sun = await level.createEntity({
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
        transform: new Transform({
            position: new Vector2(canvasSize.width / 2 - 200, canvasSize.height / 2 - 200),
            scale: new Vector2(0.5, 0.5),
        }),
        behavior: new Earth(sun),
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
