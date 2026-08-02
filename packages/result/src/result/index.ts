/**
 * Represents a successful result containing a value
 */
export interface Ok<V> {
    readonly status: "ok";
    readonly value: V;
}

/**
 * Represents a failed result containing an error
 */
export interface Err<E> {
    readonly status: "error";
    readonly error: E;
}

/**
 * Union type representing either success or failure
 */
export type Result<V, E = unknown> = Ok<V> | Err<E>;

/**
 * Pattern matching interface for Result type
 */
export interface ResultMatch<V, E, T> {
    success: (value: V) => T;
    failure: (error: E) => T;
}

/**
 * Checks if a value is a Result type
 * @param result - The value to check
 * @returns True if value is a Result
 */
export function isResult<V, E>(result: unknown): result is Result<V, E> {
    return isOk(result as any) || isErr(result as any);
}

/**
 * Checks if a Result is an Ok variant
 * @param result - The Result to check
 * @returns True if the Result is Ok
 */
export function isOk<V, E>(result: Result<V, E>): result is Ok<V> {
    return result != null && typeof result === "object" && "status" in result && result.status === "ok";
}

/**
 * Checks if a Result is an Err variant
 * @param result - The Result to check
 * @returns True if the Result is Err
 */
export function isErr<V, E>(result: Result<V, E>): result is Err<E> {
    return result != null && typeof result === "object" && "status" in result && result.status === "error";
}

/**
 * Creates an Ok Result with the given value
 * @param value - The success value
 * @returns An Ok Result
 */
export function ok<V>(value: V): Ok<V> {
    return { status: "ok", value };
}

/**
 * Creates an Err Result with the given error
 * @param error - The error value
 * @returns An Err Result
 */
export function err<E>(error: E): Err<E> {
    return { status: "error", error };
}
