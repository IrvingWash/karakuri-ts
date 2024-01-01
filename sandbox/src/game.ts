import {
    Karakuri,
    Vector2,
    Sprite,
    Transform,
} from "karakuri";

import circle from "../assets/circle.png";
import square from "../assets/square.png";

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

    await level.createEntity({
        transform: new Transform({
            position: new Vector2(anchor.transform.position.x, 100),
        }),
        sprite: new Sprite({
            path: circle,
            color: [1, 0, 0, 1],
        }),
    });

    await level.createEntity({
        transform: new Transform({
            position: new Vector2(anchor.transform.position.x + (anchor.sprite?.clip.width ?? 0) / 2, (anchor.sprite?.clip.height ?? 0) / 2),
            scale: new Vector2(0.1, 1),
        }),
        sprite: new Sprite({
            path: square,
            color: [0, 0, 1, 1],
        }),
    });

    level.start();
}
