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

class Ball extends Behavior {
    private _anchor?: IEntity;
    private _speed: number = 100;

    public override onStart(): void {
        this._anchor = this.getEntity("Anchor");
    }

    public override onUpdate(deltaTime: number): void {
        this._move();

        const springForce = ParticleForceGenerator.springForce(
            this.particle!.getParticle(),
            this._anchor!.particle!.getParticle(),
            100,
            1,
        );

        const dragForce = ParticleForceGenerator.dragForce(
            this.particle!.getParticle(),
            0.001,
        );

        this.particle?.addForce(springForce);
        this.particle?.addForce(dragForce);

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
        name: "Anchor",
        sprite: new Sprite({
            path: circle,
            color: [7, 0, 0, 1],
        }),
        transform: new Transform({
            position: new Vector2(500, 300),
        }),
        particle: new ParticleComponent(0),
    });

    level.start();
}
