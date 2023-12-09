export function ensureExists<T extends {}>(value: T | null | undefined, message?: string): T {
    if (value === null) {
        throw new Error(message ?? "Value is null");
    }

    if (value === undefined) {
        throw new Error(message ?? "Value is undefined");
    }

    return value;
}
