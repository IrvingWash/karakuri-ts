export { Karakuri, type EngineConfiguration } from "./api/karakuri";
export type { IEntity, EntityParams } from "./core/objects";

export { Transform } from "./components/transform";
export type { ITransform } from "./core/objects";
export { Behavior } from "./components/behavior";
export { Sprite } from "./components/sprite";
export type { Clip, ISprite } from "./core/sprite-renderer";

export { Trigonometry } from "./math/trigonometry";
export { Vector2, type IVector2 } from "./math/vector2";

// TODO: Delete this export when Particle or RigidBody component is available.
export { Particle, type IParticle, ParticleForceGenerator } from "./physics/particle";
