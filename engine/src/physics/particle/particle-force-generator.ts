import { IVector2, Vector2 } from "../../math/vector2";
import { IParticle } from "./iparticle";
import { clamp } from "../../utils/clamp";

const defaultWeightForceConstant = new Vector2(0, 9.8);

export class ParticleForceGenerator {
    private constructor() {};

    public static weightForce(particle: IParticle, constant: IVector2 = defaultWeightForceConstant): IVector2 {
        if (particle.getMass() === 0) {
            return new Vector2();
        }

        return constant.toScaled(particle.getMass());
    }

    public static dragForce(particle: IParticle, constant: number): IVector2 {
        if (particle.getMass() === 0) {
            return new Vector2();
        }

        const squaredMagnitude = particle.getVelocity().getSquaredMagnitude();

        if (squaredMagnitude <= 0) {
            return new Vector2();
        }

        const dragDirection = particle.getVelocity().toNormalized().scale(-1);

        const dragMagnitude = constant * squaredMagnitude;

        return dragDirection.scale(dragMagnitude);
    }

    public static frictionForce(particle: IParticle, constant: number): IVector2 {
        if (particle.getMass() === 0) {
            return new Vector2();
        }

        const frictionDirection = particle.getVelocity().toNormalized().scale(-1);

        return frictionDirection.scale(constant);
    }

    public static gravitationalForce(
        particle: IParticle,
        other: IParticle,
        constant: number,
        minDistance: number,
        maxDistance: number,
    ): IVector2 {
        if (particle.getMass() === 0 || other.getMass() === 0) {
            return new Vector2();
        }

        const distanceVector = other.getPosition().toSubtracted(particle.getPosition());

        const squaredDistance = clamp(distanceVector.getSquaredMagnitude(), minDistance, maxDistance);

        const attractionDirection = distanceVector.toNormalized();

        const attractionMagnitude = constant * (particle.getMass() * other.getMass()) / squaredDistance;

        return attractionDirection.scale(attractionMagnitude);
    }

    public static springForce(
        particle: IParticle,
        anchor: IParticle,
        restLength: number,
        constant: number,
    ): IVector2 {
        const distanceVector = particle.getPosition().toSubtracted(anchor.getPosition());

        const displacement = distanceVector.getMagnitude() - restLength;

        const springDirection = distanceVector.toNormalized();

        const springMagnitude = -constant * displacement;

        return springDirection.scale(springMagnitude);
    }
};
