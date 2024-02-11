import {
    Karakuri,
    Vector2,
    Sprite,
    Behavior,
    Transform,
    ParticleComponent,
    IEntity,
    ParticleForceGenerator,
} from "karakuri";

import circle from "../assets/circle.png";

class Sun extends Behavior {
    private _earth!: IEntity;

    public addEarth(earth: IEntity): void {
        this._earth = earth;
    }

    public override onUpdate(deltaTime: number): void {
        const gravitationalForce = ParticleForceGenerator.gravitationalForce(
            this.particle!.getParticle(),
            this._earth.particle!.getParticle(),
            1000,
            5, 100,
        );

        this.particle?.addForce(gravitationalForce);

        this.particle?.getParticle().integrate(deltaTime);
    }
}

class Earth extends Behavior {
    private _sun!: IEntity;
    private _speed: number = 100;

    public addSun(sun: IEntity): void {
        this._sun = sun;
    };

    public override onUpdate(deltaTime: number): void {
        this._move();

        const gravitationalForce = ParticleForceGenerator.gravitationalForce(
            this.particle!.getParticle(),
            this._sun.particle!.getParticle(),
            1000,
            5, 100,
        );

        this.particle?.addForce(gravitationalForce);

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

    const sunBehavior = new Sun();
    const sun = await level.createEntity({
        name: "Sun",
        behavior: sunBehavior,
        sprite: new Sprite({
            path: circle,
            antialias: false,
            color: [1, 1, 0, 1],
        }),
        transform: new Transform({
            position: new Vector2(500, 500),
            scale: new Vector2(2, 2),
        }),
        particle: new ParticleComponent(20),
    });

    const earthBehavior = new Earth();
    earthBehavior.addSun(sun);

    const earth = await level.createEntity({
        name: "Earth",
        behavior: earthBehavior,
        sprite: new Sprite({
            path: circle,
            antialias: false,
            color: [0, 0.8, 1, 1],
        }),
        transform: new Transform({
            position: new Vector2(200, 200),
            scale: new Vector2(0.5, 0.5),
        }),
        particle: new ParticleComponent(1),
    });

    sunBehavior.addEarth(earth);

    level.start();
}
