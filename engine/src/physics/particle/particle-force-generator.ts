import { IVector2, Vector2 } from "../../math/vector2";
import { IParticle } from "./iparticle";

const defaultWeightForceConstant = new Vector2(0, 9.8);

export class ParticleForceGenerator {
    private constructor() {};

    public static weightForce(particle: IParticle, constant: IVector2 = defaultWeightForceConstant): IVector2 {
        if (particle.getMass() === 0) {
            return new Vector2();
        }

        return constant.toScaled(particle.getMass());
    }
};
