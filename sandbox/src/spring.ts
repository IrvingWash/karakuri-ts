import {
    Karakuri,
    ParticleComponent,
    Sprite,
    Transform,
    Vector2,
    Behavior,
    IEntity,
    ParticleForceGenerator,
} from "karakuri";

import circle from "../assets/circle.png";
import square from "../assets/square.png";

class Rope extends Behavior {
    private _anchor?: IEntity;
    private _ball?: IEntity;

    public override onStart(): void {
        this._anchor = this.getEntity("Anchor");
        this._ball = this.getEntity("Ball");

        this.transform.position.set(new Vector2(
            this._anchor!.transform.position.x + this._anchor!.sprite!.clip.width / 2,
            this._anchor!.transform.position.y + this._anchor!.sprite!.clip.height / 2,
        ));
    }

    public override onUpdate(_deltaTime: number): void {
        const distance = this._ball!.transform.position.toSubtracted(this._anchor!.transform.position).getMagnitude();

        this.transform.scale = new Vector2(
            Math.min(1 / distance * 10, 0.1),
            distance / 100,
        );

        this.transform.rotation.set(new Vector2(this._findRotation(), 0));
    }

    private _findRotation(): number {
        const a = this._anchor!.transform.position.y - this._ball!.transform.position.y;

        const b = this._anchor!.transform.position.x - this._ball!.transform.position.x;

        return -Math.atan(b / a);
    }
}

class Ball extends Behavior {
    private _anchor?: IEntity;
    private _speed: number = 200;

    public override onStart(): void {
        this._anchor = this.getEntity("Anchor");

        this.transform.position.set(
            new Vector2(
                this.transform.position.x,
                this.transform.position.y,
            ),
        );
    }

    public override onUpdate(deltaTime: number): void {
        this._move();

        const springForce = ParticleForceGenerator.springForce(
            this.particle!.getParticle(),
            this._anchor!.particle!.getParticle(),
            200,
            10,
        );

        const dragForce = ParticleForceGenerator.dragForce(
            this.particle!.getParticle(),
            0.001,
        );

        const weightForce = ParticleForceGenerator.weightForce(this.particle!.getParticle(), new Vector2(0, 500));

        this.particle?.addForce(springForce);
        this.particle?.addForce(dragForce);
        this.particle?.addForce(weightForce);

        this.particle?.getParticle().integrate(deltaTime);
    }

    private _move(): void {
        if (this.input.isKeyDown("w")) {
            this.particle?.addForce(new Vector2(0, -this._speed));
        }

        if (this.input.isKeyDown("a")) {
            this.particle?.addForce(new Vector2(-this._speed, 0));
        }

        if (this.input.isKeyDown("s")) {
            this.particle?.addForce(new Vector2(0, this._speed));
        }

        if (this.input.isKeyDown("d")) {
            this.particle?.addForce(new Vector2(this._speed, 0));
        }
    }
}

export async function game(): Promise<void> {
    const engine = new Karakuri({ clearColor: [0.7, 0.7, 0.7, 1] });
    await engine.init();

    const level = engine.createScene();

    await level.createEntity({
        name: "Anchor",
        sprite: new Sprite({
            path: circle,
            color: [0, 8, 0, 1],
        }),
        transform: new Transform({
            position: new Vector2(500, 0),
        }),
        particle: new ParticleComponent(0),
    });

    await level.createEntity({
        name: "Ball",
        sprite: new Sprite({
            path: circle,
            color: [0, 0, 8, 1],
        }),
        transform: new Transform({
            position: new Vector2(500, 500),
            scale: new Vector2(0.5, 0.5),
        }),
        particle: new ParticleComponent(0.5),
        behavior: new Ball(),
    });

    await level.createEntity({
        name: "Rope",
        sprite: new Sprite({
            path: square,
            color: [8, 0, 0, 1],
        }),
        transform: new Transform({}),
        behavior: new Rope(),
    });

    level.start();
}
