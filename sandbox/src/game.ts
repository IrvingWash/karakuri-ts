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
    IVector2,
} from "karakuri";

import circle from "../assets/circle.png";
import square from "../assets/square.png";

class Ball extends Behavior {
    private _particle!: IParticle;
    private _anchor: IVector2 | null = null;
    private _isHolding: boolean = false;

    public onStart(): void {
        this._particle = new Particle(this.transform.position, 0.1);

        addEventListener("mousedown", () => {
            this._isHolding = true;
        });

        addEventListener("mouseup", () => {
            this._isHolding = false;
        });

        addEventListener("mousemove", (event) => {
            if (!this._isHolding) {
                return;
            }

            this.transform.position.add(
                new Vector2(
                    event.clientX - this.transform.position.x,
                    event.clientY - this.transform.position.y,
                ),
            );
        });
    }

    public onUpdate(deltaTime: number): void {
        if (this._anchor === null) {
            return;
        }

        ParticleForceGenerator.anchoredSpring(this._particle, this._anchor, 5, 300),
        ParticleForceGenerator.gravity(this._particle, new Vector2(0, 500));
        ParticleForceGenerator.drag(this._particle, 0.003);

        this._particle.integrate(deltaTime);
    }

    public setAnchor(anchor: IVector2): void {
        this._anchor = anchor;
    }
}

class Rope extends Behavior {
    private _ball: IEntity | null = null;
    private _anchor: IEntity | null = null;

    public setBallAndAnchor(ball: IEntity, anchor: IEntity): void {
        this._ball = ball;
        this._anchor = anchor;
    }

    public onUpdate(_deltaTime: number): void {
        if (this._ball === null || this._anchor === null) {
            return;
        }

        const ropeScale = new Vector2(this.transform.scale.x, this._ball.transform.position.y / 100);

        this.transform.scale = ropeScale;
    }
}

export async function game(): Promise<void> {
    const engine = new Karakuri({ clearColor: [0.7, 0.7, 0.7, 1] });
    await engine.init();

    const level = engine.createScene();
    const canvasSize = engine.getCanvasSize();

    const anchor = await level.createEntity({
        transform: new Transform({
            position: new Vector2(canvasSize.width / 2, 0),
        }),
        sprite: new Sprite({
            path: circle,
            color: [0, 1, 0, 1],
        }),
    });

    const ballBehavior = new Ball();
    ballBehavior.setAnchor(anchor.transform.position);

    const ball = await level.createEntity({
        transform: new Transform({
            position: new Vector2(anchor.transform.position.x, 100),
        }),
        sprite: new Sprite({
            path: circle,
            color: [1, 0, 0, 1],
        }),
        behavior: ballBehavior,
    });

    const ropeBehavior = new Rope();
    ropeBehavior.setBallAndAnchor(ball, anchor);

    await level.createEntity({
        transform: new Transform({
            position: new Vector2(anchor.transform.position.x + (anchor.sprite?.clip.width ?? 0) / 2, (anchor.sprite?.clip.height ?? 0) / 2),
            scale: new Vector2(0.1, 1),
        }),
        sprite: new Sprite({
            path: square,
            color: [0, 0, 1, 1],
        }),
        behavior: ropeBehavior,
    });

    level.start();
}
