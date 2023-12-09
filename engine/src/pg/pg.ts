import { ensureExists } from "../utils/existance-ensurer";

export function pg(): void {
    console.log(ensureExists(5));
}
