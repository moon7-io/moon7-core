export type Lazy<T> = () => T;

/**
 * Creates a memoized lazy initializer that computes the value once on first access
 * and returns the same cached value for all subsequent calls.
 *
 * @example
 * const now = lazy(() => Date.now());
 * const first = now();
 * const second = now();
 * // first === second
 */
export function lazy<T>(factory: () => T): Lazy<T> {
    let result: [T] | null = null;
    return () => {
        result ??= [factory()];
        return result[0];
    };
}

/**
 * Creates a proxy-backed object that defers struct initialization until the first
 * property read, then forwards all reads to the initialized value.
 *
 * @example
 * const config = lazyStruct(() => ({ retries: 3, mode: "safe" }));
 * const retries = config.retries; // init runs here
 * const mode = config.mode; // reuses initialized value
 */
export function lazyStruct<T extends {}>(init: Lazy<T>): T {
    let result: [T] | null = null;
    return new Proxy<T>({} as T, {
        get(target, prop, receiver) {
            result ??= [init()];
            return Reflect.get(result[0], prop, receiver);
        },
        set(target, prop, value) {
            result ??= [init()];
            return Reflect.set(result[0], prop, value);
        },
    });
}
