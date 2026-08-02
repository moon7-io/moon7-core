type SyncFn<T> = () => T;
type AsyncFn<T> = () => Promise<T>;
type AnyFn<T> = SyncFn<T> | AsyncFn<T>;

export function safe<T, U>(fn: SyncFn<T>, fallback: U): T | U;
export function safe<T>(fn: SyncFn<T>): T | undefined;
export function safe<T>(fn: AsyncFn<T>): Promise<T | undefined>;
export function safe<T, U>(fn: AsyncFn<T>, fallback: U): Promise<T | U>;
export function safe<T, U>(fn: AnyFn<T>, fallback?: U): any {
    try {
        const result = fn();
        if (result instanceof Promise) {
            return result.catch(() => fallback);
        }
        return result;
    } catch (_ex) {
        return fallback;
    }
}
