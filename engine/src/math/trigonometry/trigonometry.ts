const PI_BY_SEMICIRCLE = Math.PI / 180;
const SEMICIRCLE_BY_PI = 180 / Math.PI;

export class Trigonometry {
    private constructor() {}

    public static degToRad(angle: number): number {
        return angle * PI_BY_SEMICIRCLE;
    }
    public static radToDeg(angle: number): number {
        return angle * SEMICIRCLE_BY_PI;
    }
}
