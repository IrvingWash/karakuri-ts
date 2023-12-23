import {
    Karakuri,
    Behavior,
    Transform,
    Vector2,
    Sprite,
    Trigonometry,
    IParticle,
    Particle,
} from "karakuri";
import { ParticleForceGenerator } from "karakuri";

class MovableObject extends Behavior {
    private _speed: number = 500;
    private _particle!: IParticle;

    public onStart(): void {
        this._particle = new Particle(this.transform.position);
    }

    public onUpdate(deltaTime: number): void {
        this._move(deltaTime);
        ParticleForceGenerator.drag(this._particle, 2);
        ParticleForceGenerator.gravity(this._particle, new Vector2(10, 10));
        this._particle.integrate(deltaTime);
    }

    private _move(time: number): void {
        const left = this.input.isKeyDown("a") ? -1 : 0;
        const right = this.input.isKeyDown("d") ? 1 : 0;
        const up = this.input.isKeyDown("w") ? -1 : 0;
        const down = this.input.isKeyDown("s") ? 1 : 0;

        this._particle.addForce(new Vector2(
            (left || right) * this._speed * time,
            (up || down) * this._speed * time,
        ));
    }
}

export async function game(): Promise<void> {
    const engine = new Karakuri({ clearColor: [0.8, 0.8, 0.8, 1] });
    await engine.init();

    const level = engine.createScene();
    const canvasSize = engine.getCanvasSize();

    await level.createEntity({
        transform: new Transform({
            position: new Vector2(0, 0),
            scale: new Vector2(2, 2),
            rotation: new Vector2(Trigonometry.degToRad(90), 0),
        }),
        behavior: new MovableObject(),
        sprite: new Sprite({ path: "assets/ship-blue.png" }),
    });

    await level.createEntity({
        transform: new Transform({
            position: new Vector2(
                canvasSize.width * Math.random(), canvasSize.height * Math.random(),
            ),
        }),
        behavior: new MovableObject(),
        sprite: new Sprite({ path: "assets/circle.png" }),
    });

    await level.createEntity({
        transform: new Transform({
            position: new Vector2(
                canvasSize.width * Math.random(), canvasSize.height * Math.random(),
            ),
        }),
        behavior: new MovableObject(),
        sprite: new Sprite({ path: "assets/ship-blue.png" }),
    });

    await level.createEntity({
        transform: new Transform({
            position: new Vector2(
                canvasSize.width * Math.random(), canvasSize.height * Math.random(),
            ),
        }),
        behavior: new MovableObject(),
        sprite: new Sprite({ path: "assets/circle.png" }),
    });

    await level.createEntity({
        transform: new Transform({
            position: new Vector2(
                canvasSize.width * Math.random(), canvasSize.height * Math.random(),
            ),
            scale: new Vector2(3, 3),
        }),
        behavior: new MovableObject(),
        sprite: new Sprite({
            path: "assets/sheet.png",
            clip: {
                x: 444,
                y: 0,
                width: 91,
                height: 91,
            },
        }),
    });

    await level.createEntity({
        transform: new Transform({
            position: new Vector2(
                canvasSize.width * Math.random(), canvasSize.height * Math.random(),
            ),
        }),
        behavior: new MovableObject(),
        sprite: new Sprite({
            path: "assets/sheet.png",
            clip: {
                x: 778,
                y: 527,
                width: 31,
                height: 30,
            },
        }),
    });

    level.start();
}
