import {
    Karakuri,
    Behavior,
    IEntity,
    Transform,
    Vector2,
} from "karakuri";

class Player extends Behavior {
    public onStart(): void {
        console.log("Player created");
    }

    public onUpdate(deltaTime: number): void {
        console.log(deltaTime);
        console.log(this.transform.position);
        console.log(this.input.isKeyDown("a"));
    }

    public onCollision(other: IEntity): void {
        console.log(`Player collided with ${other}`);
    }

    public onDestroy(): void {
        console.log("Player destroyed");
    }
}

export async function game(): Promise<void> {
    const engine = new Karakuri();
    await engine.init();

    const level = engine.createScene();

    level.createEntity({
        transform: new Transform({
            position: new Vector2(10, 55),
        }),
        behavior: new Player(),
    });

    level.start();
}

game();
