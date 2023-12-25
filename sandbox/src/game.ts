import {
    Karakuri,
    Behavior,
    Vector2,
    Sprite,
    IParticle,
    Particle,
    ParticleForceGenerator,
    Transform,
    IEntity,
} from "karakuri";

import circle from "../assets/circle.png";
import square from "../assets/square.png";

class MovableObject extends Behavior {
    private _speed: number = 500;
    private _particle!: IParticle;

    public onStart(): void {
        this._particle = new Particle(this.transform.position);
    }

    public onUpdate(deltaTime: number): void {
        this._move(deltaTime);
        ParticleForceGenerator.anchoredSpring(this._particle, new Vector2(), 10, 50);
        ParticleForceGenerator.gravity(this._particle, new Vector2(0, 500));
        ParticleForceGenerator.drag(this._particle, 0.003);
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

class Rope extends Behavior {
    private _anchor: IEntity | null = null;
    private _ball: IEntity | null = null;

    public onUpdate(_deltaTime: number): void {
        if (this._anchor === null || this._ball === null) {
            return;
        }

        const scale = new Vector2(this.transform.scale.x, this._ball.transform.position.y / 100);

        this.transform.scale = scale;
    }

    public setAnchorAndBall(anchor: IEntity, ball: IEntity): void {
        this._anchor = anchor;
        this._ball = ball;
    }
}

export async function game(): Promise<void> {
    const engine = new Karakuri({ clearColor: [0.7, 0.7, 0.7, 1] });
    await engine.init();

    const level = engine.createScene();

    const ball = await level.createEntity({
        behavior: new MovableObject(),
        sprite: new Sprite({
            path: circle,
            color: [1, 0, 0, 1],
        }),
    });

    const anchor = await level.createEntity({
        sprite: new Sprite({
            path: circle,
            color: [0, 0, 1, 1],
        }),
        transform: new Transform({
            position: new Vector2(25, 0),
            scale: new Vector2(0.5, 0.5),
        }),
    });

    const ropeBehavior = new Rope();
    ropeBehavior.setAnchorAndBall(anchor, ball);

    await level.createEntity({
        sprite: new Sprite({
            path: square,
            color: [0, 1, 0, 1],
        }),
        transform: new Transform({
            position: new Vector2(45, 50),
            scale: new Vector2(0.1, 1),
        }),
        behavior: ropeBehavior,
    });

    level.start();
}
