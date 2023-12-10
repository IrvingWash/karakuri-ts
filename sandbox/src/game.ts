import { type IScene, Scene, Behavior } from "karakuri";

const scene: IScene = new Scene();

class Player extends Behavior {
    public onStart(): void {
        console.log("Player started");
    }

    public onUpdate(deltaTime: number): void {
        console.log("player", deltaTime);
    }
}

scene.createEntity({
    behavior: new Player(),
});

scene.start();
