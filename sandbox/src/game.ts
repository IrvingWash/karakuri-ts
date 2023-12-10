import { type IScene, Scene, Behavior } from "karakuri";

class Player extends Behavior {
    public onStart(): void {
        console.log("Player started");
    }

    public onUpdate(deltaTime: number): void {
        console.log("player", deltaTime);
    }
}

export async function game(): Promise<void> {
    const scene: IScene = new Scene();

    scene.init();

    scene.createEntity({
        behavior: new Player(),
    });

    scene.start();
    setTimeout(() => {
        scene.pause();
    }, 1000);
}
