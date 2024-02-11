import {
    Karakuri,
    Vector2,
    Sprite,
    Behavior,
    Transform,
    ParticleComponent,
    ParticleForceGenerator,
} from "karakuri";

import square from "../assets/square.png";

class Box extends Behavior {
    private _speed = 100;

    public onStart(): void {
        console.log("Box created");
    }

    public onUpdate(deltaTime: number): void {
        this._move(deltaTime);
        this.particle?.addForce(
            ParticleForceGenerator.weightForce(
                this.particle.getParticle(),
                new Vector2(0, 500),
            ),
        );

        this.particle?.getParticle().integrate(deltaTime);
    }

    public onDestroy(): void {
        console.log("Box destroyed");
    }

    private _move(deltaTime: number): void {
        if (this.input.isKeyDown("a")) {
            this.transform.position.subtract(new Vector2(this._speed * deltaTime, 0));
        }

        if (this.input.isKeyDown("d")) {
            this.transform.position.add(new Vector2(this._speed * deltaTime, 0));
        }

        if (this.input.isKeyDown("w")) {
            this.transform.position.subtract(new Vector2(0, this._speed * deltaTime));
        }

        if (this.input.isKeyDown("s")) {
            this.transform.position.add(new Vector2(0, this._speed * deltaTime));
        }
    }
}

export async function game(): Promise<void> {
    const engine = new Karakuri({ clearColor: [0.7, 0.7, 0.7, 1] });
    await engine.init();

    const level = engine.createScene();

    level.createEntity({
        name: Box.name,
        behavior: new Box(),
        transform: new Transform({
            position: new Vector2(300, 300),
            scale: new Vector2(2, 0.5),
        }),
        sprite: new Sprite({
            path: square,
            antialias: false,
            color: [0.9, 0.9, 0, 1],
        }),
        particle: new ParticleComponent(3),
    });

    level.start();
}
