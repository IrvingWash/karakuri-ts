import {
    Karakuri,
    Behavior,
    Transform,
    Vector2,
    ShapeRenderer,
} from "karakuri";

class Player extends Behavior {
    private _speed: number = 100;

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
    const engine = new Karakuri();
    await engine.init();

    const level = engine.createScene();

    level.createEntity({
        transform: new Transform({
            position: new Vector2(300, 300),
        }),
        behavior: new Player(),
        shapeRenderer: new ShapeRenderer(),
    });

    level.start();
}
