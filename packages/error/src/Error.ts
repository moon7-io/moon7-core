export type ErrorValue<T> = [any, T | undefined];
type Fn0<T> = () => T;

export function assert(cond: any, message: string = "Assertion failed"): asserts cond {
    if (!cond) {
        throw new Error(message);
    }
}

/** Allows you to throw an error as an expression */
export function raise<E>(error?: E): never {
    throw error;
}

export function safely<T>(x: Fn0<T>, defaultValue: T): T;
export function safely<T>(x: Promise<T>, defaultValue: T): Promise<T>;
export function safely<T>(x: Fn0<T> | Promise<T>, defaultValue: T): T | Promise<T> {
    if (typeof x === "function") {
        return safelyFunction(x, defaultValue);
    }
    return safelyPromise(x, defaultValue);
}

/** suppress errors, and instead returns a default value */
export function safelyFunction<T>(fn: () => T, defaultValue: T): T {
    try {
        return fn();
    } catch (_ex) {
        return defaultValue;
    }
}

export async function safelyAsync<T>(fn: Fn0<Promise<T> | T>, defaultValue: T): Promise<T> {
    try {
        return await fn();
    } catch (_ex) {
        return defaultValue;
    }
}

export function safelyPromise<T>(promise: Promise<T>, defaultValue: T): Promise<T> {
    return new Promise<T>((pass, _fail) => {
        promise.then(
            value => pass(value),
            _error => pass(defaultValue)
        );
    });
}

export function attempt<T>(x: Fn0<T>): ErrorValue<T>;
export function attempt<T>(x: Promise<T>): Promise<ErrorValue<T>>;
export function attempt<T>(x: Fn0<T> | Promise<T>): ErrorValue<T> | Promise<ErrorValue<T>> {
    if (typeof x === "function") {
        return attemptFunction(x);
    }
    return attemptPromise(x);
}

export function attemptFunction<T>(fn: Fn0<T>): ErrorValue<T> {
    try {
        const value = fn();
        return [undefined, value];
    } catch (ex) {
        return [ex, undefined];
    }
}

export async function attemptAsync<T>(fn: Fn0<Promise<T> | T>): Promise<ErrorValue<T>> {
    try {
        const value = await fn();
        return [undefined, value];
    } catch (ex) {
        return [ex, undefined];
    }
}

export function attemptPromise<T>(promise: Promise<T>): Promise<ErrorValue<T>> {
    return new Promise<ErrorValue<T>>((pass, fail) => {
        promise.then(
            value => pass([undefined, value]),
            error => fail([error, undefined])
        );
    });
}

export function willThrow<T>(fn: () => T): boolean {
    try {
        fn();
        return false;
    } catch (_ex) {
        return true;
    }
}

export function must<T>(value: T | undefined, errorMessage = "Value is undefined"): T {
    if (value === undefined) {
        throw new Error(errorMessage);
    }
    return value;
}
