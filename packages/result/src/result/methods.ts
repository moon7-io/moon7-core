import { None } from "~/maybe";
import { err, isOk, Ok, ok, Result, ResultMatch } from "~/result";
import { all, ResultTuple } from "~/result/util";
import { Fn, Fn1, Predicate } from "~/util/types";

/**
 * Applies pattern matching on a Result
 * @param result - The Result to match against
 * @param patterns - Object containing success and failure handlers
 * @returns The return value of either the success or failure handler
 */
export function match<V, E, T>(result: Result<V, E>, patterns: ResultMatch<V, E, T>): T {
    return isOk(result) ? patterns.success(result.value) : patterns.failure(result.error);
}

/**
 * Extracts the value from an Ok result or throws the error from an Err result
 * @param result - The Result to unwrap
 * @returns The value inside an Ok result
 * @throws The error inside an Err result
 */
export function unwrap<V, E>(result: Result<V, E>): V {
    if (isOk(result)) {
        return result.value;
    }
    throw result.error;
}

/**
 * Extracts the value from an Ok result or returns undefined/default value
 * @param result - The Result to unwrap
 * @param defaultValue - Optional value returned if result is Err
 * @returns The value or the default/undefined
 */
export function unwrapOr<V, E>(result: Result<V, E>): V | undefined;
export function unwrapOr<V, E>(result: Result<V, E>, defaultValue: V): V;
export function unwrapOr<V, E>(result: Result<V, E>, defaultValue?: V): V | undefined {
    return isOk(result) ? result.value : defaultValue;
}

/**
 * Extracts the value from an Ok result or maps the error to a value
 * @param result - The Result to unwrap
 * @param fn - Function to convert an error to a value
 * @returns The value or the mapped error
 */
export function unwrapOrElse<V, E>(result: Result<V, E>, fn: Fn1<E, V>): V {
    return isOk(result) ? result.value : fn(result.error);
}

/**
 * Transforms an Err result to an Ok result using a mapping function
 * @param result - The Result to recover from
 * @param fn - Function to convert an error to a value
 * @returns An Ok result
 */
export function recover<V, E>(result: Result<V, E>, fn: Fn1<E, V>): Ok<V> {
    return isOk(result) ? result : ok(fn(result.error));
}

/**
 * Maps the value inside an Ok result
 * @param result - The Result to map
 * @param fn - Function to transform the value
 * @returns A new Result with the transformed value or original error
 */
export function map<V, U, E>(result: Result<V, E>, fn: Fn1<V, U>): Result<U, E> {
    return isOk(result) ? ok(fn(result.value)) : err(result.error);
}

/**
 * Maps the error inside an Err result
 * @param result - The Result to map
 * @param fn - Function to transform the error
 * @returns A new Result with the original value or transformed error
 */
export function mapError<V, U, E>(result: Result<V, E>, fn: Fn1<E, U>): Result<V, U> {
    return isOk(result) ? ok(result.value) : err(fn(result.error));
}

/**
 * Maps both value and error of a Result
 * @param result - The Result to map
 * @param thenFn - Function to transform the value
 * @param catchFn - Function to transform the error
 * @returns A new Result with transformed value or error
 */
export function bimap<V, E, U, T>(result: Result<V, E>, thenFn: Fn1<V, U>, catchFn: Fn1<E, T>): Result<U, T> {
    return isOk(result) ? ok(thenFn(result.value)) : err(catchFn(result.error));
}

/**
 * Chains a function that returns a Result on an Ok result
 * @param result - The Result to chain
 * @param fn - Function that transforms value to another Result
 * @returns The new Result or original error
 */
export function chain<V, U, E>(result: Result<V, E>, fn: Fn1<V, Result<U, E>>): Result<U, E> {
    return isOk(result) ? fn(result.value) : err(result.error);
}

/**
 * Chains a function that returns a Result on an Err result
 * @param result - The Result to chain
 * @param fn - Function that transforms error to another Result
 * @returns The original Ok value or new Result
 */
export function chainError<V, U, E>(result: Result<V, E>, fn: Fn1<E, Result<V, U>>): Result<V, U> {
    return isOk(result) ? ok(result.value) : fn(result.error);
}

/**
 * Performs side effect on Ok result while preserving the original Result
 * @param result - The Result to tap
 * @param fn - Side effect function for value
 * @returns The original Result
 */
export function tap<V, U, E>(result: Result<V, E>, fn: Fn1<V, Result<U, E>>): Result<V, E> {
    return isOk(result) ? chain(fn(result.value), () => result) : result;
}

/**
 * Performs side effect on Err result while preserving the original Result
 * @param result - The Result to tap
 * @param fn - Side effect function for error
 * @returns The original Result
 */
export function tapError<V, U, E>(result: Result<V, E>, fn: Fn1<E, Result<V, U>>): Result<V, E> {
    return isOk(result) ? result : chainError(fn(result.error), () => result);
}

/**
 * Filters an Ok result based on a condition
 * @param result - The Result to filter
 * @param cond - Predicate function for the value
 * @returns Ok result if condition passes, otherwise Err(undefined)
 */
export function filter<V, E>(result: Result<V, E>, cond: Predicate<V>): Result<V, None> {
    return isOk(result) && cond(result.value) ? ok(result.value) : err(undefined);
}

/**
 * Filters an Err result based on a condition
 * @param result - The Result to filter
 * @param cond - Predicate function for the error
 * @returns Err result if condition passes, otherwise Ok(undefined)
 */
export function filterError<V, E>(result: Result<V, E>, cond: Predicate<E>): Result<None, E> {
    return isOk(result) || !cond(result.error) ? ok(undefined) : err(result.error);
}

/**
 * Applies a function wrapped in a Result to arguments wrapped in Results
 * @param fn - Result containing a function
 * @param args - Results containing function arguments
 * @returns Result of applying the function to the arguments
 */
export function apply<A extends any[], R, E>(fn: Result<Fn<A, R>, E>, ...args: ResultTuple<A, E>): Result<R, E> {
    return chain(fn, fn => map(all(...args), args => fn(...(args as A))));
}

/**
 * Flattens a nested Result
 * @param result - The nested Result to flatten
 * @returns Flattened Result
 */
export function join<V, E>(result: Result<Result<V, E>, E>): Result<V, E> {
    return isOk(result) ? result.value : result;
}

/**
 * Swaps Ok and Err variants of a Result
 * @param result - The Result to swap
 * @returns A new Result with Ok and Err variants swapped
 */
export function swap<V, E>(result: Result<V, E>): Result<E> {
    return isOk(result) ? err(result.value) : ok(result.error);
}
