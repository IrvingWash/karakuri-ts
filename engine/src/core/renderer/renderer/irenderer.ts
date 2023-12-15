export interface IRenderer {
    drawFilledRectangle(
        x: number, y: number,
        width: number, height: number,
        color: [number, number, number, number]
    ): void;
}
