import {
    Karakuri,
    Behavior,
    Transform,
    Vector2,
    SpriteRenderer,
} from "karakuri";

import circleSprite from "../assets/circle.png";

class MovableObject extends Behavior {
    private _speed: number = 500;

    public onUpdate(deltaTime: number): void {
        this._move(deltaTime);
    }

    private _move(time: number): void {
        const left = this.input.isKeyDown("a") ? -1 : 0;
        const right = this.input.isKeyDown("d") ? 1 : 0;
        const up = this.input.isKeyDown("w") ? -1 : 0;
        const down = this.input.isKeyDown("s") ? 1 : 0;

        this.transform.position.add(new Vector2(
            (left || right) * this._speed * time,
            (up || down) * this._speed * time,
        ));
    }
}

export async function game(): Promise<void> {
    const engine = new Karakuri({ clearColor: [0, 0, 0, 1] });
    await engine.init();

    const level = engine.createScene();

    await level.createEntity({
        transform: new Transform({
            position: new Vector2(
                50, 50,
            ),
        }),
        behavior: new MovableObject(),
        spriteRenderer: new SpriteRenderer({ path: "assets/ship-blue.png" }),
    });

    await level.createEntity({
        transform: new Transform({
            position: new Vector2(
                500, 500,
            ),
        }),
        behavior: new MovableObject(),
        spriteRenderer: new SpriteRenderer({ path: "assets/ship-blue.png" }),
    });

    await level.createEntity({
        transform: new Transform({
            position: new Vector2(100, 100),
        }),
        behavior: new MovableObject(),
        spriteRenderer: new SpriteRenderer({ path: circleSprite, color: [1, 0, 0, 1] }),
    });

    await level.createEntity({
        transform: new Transform({
            position: new Vector2(1000, 1000),
        }),
        behavior: new MovableObject(),
        spriteRenderer: new SpriteRenderer({ path: circleSprite, color: [1, 0, 0, 1] }),
    });

    level.start();
}
