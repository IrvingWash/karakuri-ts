import { Vector2 } from "../../math/vector2";
import { ITransform } from "../transform";
import { Geometry } from "./geometry";

export interface RectangleInitParams {
    originalWidth?: number;
    originalHeight?: number;
}

export class Rectangle extends Geometry {
    // TODO: Add `isInitialized` field to all the classes with bangs
    private _originalWidth!: number;
    private _originalHeight!: number;

    public constructor(transform: ITransform) {
        super(transform);
    }

    public override __init(params: RectangleInitParams): void {
        this._originalWidth = params.originalWidth ?? 0;
        this._originalHeight = params.originalHeight ?? 0;
    }

    // TODO: Need to optimize these calculations
    public override getWorldVertices(): number[] {
        const { x, y } = this._transform.position;

        const width = this._originalWidth * this._transform.scale.x;
        const height = this._originalHeight * this._transform.scale.y;

        const rotation = this._transform.rotation.x;

        const v0 = new Vector2(x, y).rotateAt(this._origin, rotation);
        const v1 = new Vector2(x + width, y).rotateAt(this._origin, rotation);
        const v2 = new Vector2(x + width, y + height).rotateAt(this._origin, rotation);
        const v3 = new Vector2(x, y + height).rotateAt(this._origin, rotation);

        return [
            v0.x, v0.y, // top left
            v1.x, v1.y, // top right
            v2.x, v2.y, // bottom right
            v3.x, v3.y, // bottom left
        ];
    }
}
