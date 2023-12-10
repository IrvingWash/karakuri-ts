import { Karakuri, Behavior } from "karakuri";

class Player extends Behavior {
    public onStart(): void {
        console.log("Player started");
    }

    public onUpdate(deltaTime: number): void {
        console.log("player", deltaTime);
    }
}

export async function game(): Promise<void> {
    const karakuri = new Karakuri();
    await karakuri.init();

    const scene = karakuri.createScene();

    scene.createEntity({
        behavior: new Player(),
    });

    scene.start();
    setTimeout(() => {
        scene.pause();
    }, 1000);
}
