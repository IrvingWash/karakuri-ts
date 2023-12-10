export interface IRenderer {
    init(): Promise<void>;
    test(): void;
}
