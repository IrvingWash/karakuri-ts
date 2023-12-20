import { IVector2 } from "../../math/vector2";
import { ITransform } from "../transform";

export abstract class Geometry<InitParams = {}> {
    public abstract worldVertices: number[];

    protected _transform: ITransform;
    protected _origin: IVector2;

    public constructor(transform: ITransform, origin?: IVector2) {
        this._transform = transform;
        this._origin = origin ?? this._transform.position;
    }

    public abstract __init(params: InitParams): void;
    public abstract updateWorldVertices(): void;
}