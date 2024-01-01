import {
    Karakuri,
    Vector2,
    Sprite,
    Transform,
    Particle,
} from "karakuri";

import square from "../assets/square.png";

const PIXELS_PER_METER = 50;

export async function game(): Promise<void> {
    const engine = new Karakuri({ clearColor: [0.7, 0.7, 0.7, 1] });
    await engine.init();

    const level = engine.createScene();
    const canvasSize = engine.getCanvasSize();

    for (let i = 0; i < 10_000; i++) {
        await level.createEntity({
            particle: new Particle({
                gravity: PIXELS_PER_METER,
                mass: 0.01,
            }),
            transform: new Transform({
                position: new Vector2(Math.random() * canvasSize.width, Math.random() * canvasSize.height),
                rotation: new Vector2(0, 0),
                scale: new Vector2(0.1, 0.1),
            }),
            sprite: new Sprite({
                path: square,
                antialias: false,
                color: [Math.random(), Math.random(), Math.random(), 1],
            }),
        });
    }

    level.start();
}
