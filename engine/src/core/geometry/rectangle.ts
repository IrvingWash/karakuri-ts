import { Vector2 } from "../../math/vector2";
import { ITransform } from "../transform";
import { Geometry } from "./geometry";

interface RectangleParams {
    transform: ITransform;
    originalWidth?: number;
    originalHeight?: number;
}

export class Rectangle extends Geometry {
    public override worldVertices: number[] = [];

    private _originalWidth!: number;
    private _originalHeight!: number;

    public constructor(params: RectangleParams) {
        super(params.transform);

        this._originalWidth = params.originalWidth ?? 0;
        this._originalHeight = params.originalHeight ?? 0;

        this.updateWorldVertices();
    }

    // TODO: Need to optimize these calculations
    public override updateWorldVertices(): void {
        const { x, y } = this._transform.position;

        const width = this._originalWidth * this._transform.scale.x;
        const height = this._originalHeight * this._transform.scale.y;

        const rotation = this._transform.rotation.x;

        const v0 = new Vector2(x, y).rotateAt(this._origin, rotation);
        const v1 = new Vector2(x + width, y).rotateAt(this._origin, rotation);
        const v2 = new Vector2(x + width, y + height).rotateAt(this._origin, rotation);
        const v3 = new Vector2(x, y + height).rotateAt(this._origin, rotation);

        this.worldVertices = [
            v0.x, v0.y, // top left
            v1.x, v1.y, // top right
            v2.x, v2.y, // bottom right
            v3.x, v3.y, // bottom left
        ];
    }
}
