import { None } from "~/maybe";
import { Ok, Result, ResultMatch } from "~/result";
import * as R from "~/result/methods";
import { ResultTuple } from "~/result/util";
import { Fn, Fn1, Predicate } from "~/util/types";

/**
 * A function type that operates on a Result and returns a transformed value
 */
export type ResultFn<V, E, T> = (result: Result<V, E>) => T;

/**
 * Creates a function that applies pattern matching on a Result
 * @param patterns - Object containing success and failure handlers
 * @returns A function that returns the result of either the success or failure handler
 */
export function match<V, E, T>(patterns: ResultMatch<V, E, T>): ResultFn<V, E, T> {
    return result => R.match(result, patterns);
}

/**
 * Creates a function that extracts the value from an Ok result or throws the error from an Err result
 * @returns A function that unwraps a Result
 * @throws The error inside an Err result
 */
export function unwrap<V, E>(): ResultFn<V, E, V> {
    return result => R.unwrap(result);
}

/**
 * Creates a function that extracts the value from an Ok result or returns undefined/default value
 * @param defaultValue - Optional value returned if result is Err
 * @returns A function that safely unwraps a Result with a fallback
 */
export function unwrapOr<V, E>(): ResultFn<V, E, V | undefined>;
export function unwrapOr<V, E>(defaultValue: V): ResultFn<V, E, V>;
export function unwrapOr<V, E>(defaultValue?: V): ResultFn<V, E, V | undefined> {
    return result => R.unwrapOr(result, defaultValue);
}

/**
 * Creates a function that extracts the value from an Ok result or maps the error to a value
 * @param fn - Function to convert an error to a value
 * @returns A function that returns the value or the mapped error
 */
export function unwrapOrElse<V, E>(fn: Fn1<E, V>): ResultFn<V, E, V> {
    return result => R.unwrapOrElse(result, fn);
}

/**
 * Creates a function that transforms an Err result to an Ok result using a mapping function
 * @param fn - Function to convert an error to a value
 * @returns A function that returns an Ok result
 */
export function recover<V, E>(fn: Fn1<E, V>): ResultFn<V, E, Ok<V>> {
    return result => R.recover(result, fn);
}

/**
 * Creates a function that maps the value inside an Ok result
 * @param fn - Function to transform the value
 * @returns A function that returns a new Result with the transformed value or original error
 */
export function map<V, U, E>(fn: Fn1<V, U>): ResultFn<V, E, Result<U, E>> {
    return result => R.map(result, fn);
}

/**
 * Creates a function that maps the error inside an Err result
 * @param fn - Function to transform the error
 * @returns A function that returns a new Result with the original value or transformed error
 */
export function mapError<V, U, E>(fn: Fn1<E, U>): ResultFn<V, E, Result<V, U>> {
    return result => R.mapError(result, fn);
}

/**
 * Creates a function that maps both value and error of a Result
 * @param thenFn - Function to transform the value
 * @param catchFn - Function to transform the error
 * @returns A function that returns a new Result with transformed value or error
 */
export function bimap<V, E, U, T>(thenFn: Fn1<V, U>, catchFn: Fn1<E, T>): ResultFn<V, E, Result<U, T>> {
    return result => R.bimap(result, thenFn, catchFn);
}

/**
 * Creates a function that chains a function that returns a Result on an Ok result
 * @param fn - Function that transforms value to another Result
 * @returns A function that returns the new Result or original error
 */
export function chain<V, U, E>(fn: Fn1<V, Result<U, E>>): ResultFn<V, E, Result<U, E>> {
    return result => R.chain(result, fn);
}

/**
 * Creates a function that chains a function that returns a Result on an Err result
 * @param fn - Function that transforms error to another Result
 * @returns A function that returns the original Ok value or new Result
 */
export function chainError<V, U, E>(fn: Fn1<E, Result<V, U>>): ResultFn<V, E, Result<V, U>> {
    return result => R.chainError(result, fn);
}

/**
 * Creates a function that performs side effect on Ok result while preserving the original Result
 * @param fn - Side effect function for value
 * @returns A function that returns the original Result
 */
export function tap<V, U, E>(fn: Fn1<V, Result<U, E>>): ResultFn<V, E, Result<V, E>> {
    return result => R.tap(result, fn);
}

/**
 * Creates a function that performs side effect on Err result while preserving the original Result
 * @param fn - Side effect function for error
 * @returns A function that returns the original Result
 */
export function tapError<V, U, E>(fn: Fn1<E, Result<V, U>>): ResultFn<V, E, Result<V, E>> {
    return result => R.tapError(result, fn);
}

/**
 * Creates a function that filters an Ok result based on a condition
 * @param cond - Predicate function for the value
 * @returns A function that returns Ok result if condition passes, otherwise Err(undefined)
 */
export function filter<V, E>(cond: Predicate<V>): ResultFn<V, E, Result<V, None>> {
    return result => R.filter(result, cond);
}

/**
 * Creates a function that filters an Err result based on a condition
 * @param cond - Predicate function for the error
 * @returns A function that returns Err result if condition passes, otherwise Ok(undefined)
 */
export function filterError<V, E>(cond: Predicate<E>): ResultFn<V, E, Result<None, E>> {
    return result => R.filterError(result, cond);
}

/**
 * Creates a function that applies a function wrapped in a Result to arguments wrapped in Results
 * @param args - Results containing function arguments
 * @returns A function that returns Result of applying the function to the arguments
 */
export function apply<A extends any[], R, E>(...args: ResultTuple<A, E>): ResultFn<Fn<A, R>, E, Result<R, E>> {
    return fn => R.apply(fn, ...args);
}

/**
 * Creates a function that flattens a nested Result
 * @returns A function that returns a flattened Result
 */
export function join<V, E>(): ResultFn<Result<V, E>, E, Result<V, E>> {
    return result => R.join(result);
}

/**
 * Creates a function that swaps Ok and Err variants of a Result
 * @returns A function that returns a new Result with Ok and Err variants swapped
 */
export function swap<V, E>(): ResultFn<V, E, Result<E>> {
    return result => R.swap(result);
}
