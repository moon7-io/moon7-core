import { map } from "./methods";
import { adapt, Callback } from "~/callback";
import { Either, isRight } from "~/either";
import { err, isOk, ok, Result } from "~/result";
import { Fn } from "~/util/types";

/**
 * Converts a function that might throw into a Result
 * @param fn - Function that may throw an exception
 * @returns Ok with the function's return value or Err with the caught error
 */
export function fromTry<V, E>(fn: () => V): Result<V, E> {
    try {
        return ok<V>(fn());
    } catch (error) {
        return err<E>(error as E);
    }
}

/**
 * Asynchronously converts a function that might throw into a Result
 * @param fn - Async function that may throw an exception
 * @returns Promise of Ok with the function's return value or Err with the caught error
 */
export async function fromTryAsync<V, E>(fn: () => Promise<V> | V): Promise<Result<V, E>> {
    try {
        return ok<V>(await fn());
    } catch (error) {
        return err<E>(error as E);
    }
}

/**
 * Converts a promise into a Result
 * @param promise - The promise to convert
 * @returns Promise of Ok with resolved value or Err with rejected error
 */
export async function fromPromise<V, E>(promise: Promise<V>): Promise<Result<V, E>> {
    try {
        return ok<V>(await promise);
    } catch (error) {
        return err<E>(error as E);
    }
}

/**
 * Converts a nullable value into a Result
 * @param value - The value to check for null/undefined
 * @param error - Optional error to use if value is null/undefined
 * @returns Ok with value if not null/undefined, otherwise Err with error
 */
export function fromNullable<V>(value: V | null | undefined): Result<V, undefined>;
export function fromNullable<V, E>(value: V | null | undefined, error: E): Result<V, E>;
export function fromNullable<V, E>(value: V | null | undefined, error?: E): Result<V, E | undefined> {
    return value != null ? ok(value) : err(error);
}

// const text = await fromNodeCallback<NonSharedBuffer, NodeJS.ErrnoException>((cb) => readFile("package.json", cb));
/**
 * Converts a callback-style function into a Promise of Result
 * @param fn - Function that takes a callback
 * @returns Promise of Result from the callback
 */
export function fromCallback<V, E>(fn: (callback: Callback<V, E>) => void): Promise<Result<V, E>> {
    return new Promise<Result<V, E>>(resolve => fn(adapt(resolve)(ok, err)));
}

/**
 * Converts an Either to a Result
 * @param either - The Either to convert
 * @returns Result with the same value and error
 */
export function fromEither<V, E>(either: Either<E, V>): Result<V, E> {
    return isRight(either) ? ok(either[1]) : err(either[0]);
}

/**
 * Combines multiple Results into a single Result containing an array of values
 * @param many - Results to combine
 * @returns Ok with array of values if all Results are Ok, otherwise the first Err
 */
export function all<V, E>(...many: Result<V, E>[]): Result<V[], E> {
    const values: V[] = [];
    for (const item of many) {
        if (!isOk(item)) {
            return item;
        }
        values.push(item.value);
    }
    return ok(values);
}

/**
 * Returns the first Ok Result or an Err with all errors combined
 * @param many - Results to check
 * @returns First Ok Result or Err containing array of all errors
 */
export function any<V, E>(...many: Result<V, E>[]): Result<V, E[]> {
    let errors: E[] = [];
    for (const item of many) {
        if (isOk(item)) {
            return item;
        }
        errors.push(item.error);
    }
    return err(errors);
}

/**
 * Type for a function that lifts a regular function to operate on Results
 */
export type LiftedResult<A extends any[], B, E> = (...results: ResultTuple<A, E>) => Result<B, E>;

/**
 * Type representing a tuple of Results corresponding to function arguments
 */
export type ResultTuple<A extends any[], E> = { [K in keyof A]: Result<A[K], E> };

/**
 * Lifts a regular function to work with Result-wrapped values
 * @param fn - Regular function to lift
 * @returns A function that works with Result-wrapped arguments
 */
export function lift<A extends any[], B, E>(fn: Fn<A, B>): LiftedResult<A, B, E> {
    return (...results) => map(all(...results), args => fn(...(args as A)));
}
