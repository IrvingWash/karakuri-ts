import {
    Karakuri,
    Vector2,
    Sprite,
    Transform,
    Particle,
    Behavior,
    ParticleForceGenerator,
} from "karakuri";

import square from "../assets/square.png";

const PIXELS_PER_METER = 50;

class MovableObject extends Behavior {
    public override onUpdate(_deltaTime: number): void {
        const particlePhysics = this.particle?.getParticlePhysics();

        if (particlePhysics === undefined) {
            return;
        }

        const dragForce = ParticleForceGenerator.dragForce(particlePhysics, 1);

        particlePhysics.addForce(dragForce);
    }
}

export async function game(): Promise<void> {
    const engine = new Karakuri({ clearColor: [0.7, 0.7, 0.7, 1] });
    await engine.init();

    const level = engine.createScene();
    const canvasSize = engine.getCanvasSize();

    for (let i = 0; i < 10_000; i++) {
        await level.createEntity({
            behavior: new MovableObject(),
            particle: new Particle({
                gravity: new Vector2(0, PIXELS_PER_METER),
                mass: 1,
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
