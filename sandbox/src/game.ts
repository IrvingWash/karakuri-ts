import {
    Karakuri,
    Vector2,
    Sprite,
    Transform,
    Particle,
} from "karakuri";

import square from "../assets/square.png";

export async function game(): Promise<void> {
    const engine = new Karakuri({ clearColor: [0.7, 0.7, 0.7, 1] });
    await engine.init();

    const level = engine.createScene();

    level.createEntity({
        particle: new Particle(1),
        transform: new Transform({
            position: new Vector2(500, 500),
            rotation: new Vector2(45, 0),
        }),
        sprite: new Sprite({
            path: square,
            antialias: false,
            color: [1, 0, 0, 1],
        }),
    });

    level.start();
}
