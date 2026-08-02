import { type Result, isOk, ok, err } from "~/result";
import { unwrapOr } from "~/result/methods";
import { fromPromise, fromTry } from "~/result/util";
import { Fn0 } from "~/util/types";

/**
 * Throws the provided error.
 *
 * @template E - Type of the error
 * @param error - The error to throw
 * @returns Never returns as this function always throws
 */
export function raise<E>(error?: E): never {
    throw error;
}

/**
 * Safely executes a function or resolves a promise, returning a default value if an error occurs.
 * This function should never throw an error.
 *
 * @template T - Type of the return value
 * @param x - Function that returns T or Promise<T>, or a Promise<T>
 * @param defaultValue - Value to return if the function throws or the promise rejects
 * @returns The result of the function or promise, or the default value if an error occurred
 */
export function safely<T>(x: Fn0<T>, defaultValue: T): T;
export function safely<T>(x: Fn0<Promise<T>>, defaultValue: T): Promise<T>;
export function safely<T>(x: Promise<T>, defaultValue: T): Promise<T>;
export function safely<T>(x: Fn0<T | Promise<T>> | Promise<T>, defaultValue: T): T | Promise<T> {
    if (typeof x === "function") {
        const result = fromTry(x);
        if (isOk(result)) {
            if (result.value instanceof Promise) {
                return fromPromise(result.value).then(value => unwrapOr(value, defaultValue));
            }
            return result.value;
        }
        return defaultValue;
    }
    if (x instanceof Promise) {
        return fromPromise(x).then(value => unwrapOr(value, defaultValue));
    }
    return defaultValue;
}

/**
 * Attempts to execute a function or resolve a promise, returning the result wrapped in a Result object.
 *
 * @template T - Type of the return value
 * @param x - Function that returns T or Promise<T>, or a Promise<T>
 * @returns A Result containing the value if successful, or the error if the function threw or promise rejected
 */
export function attempt<T>(x: Fn0<T>): Result<T>;
export function attempt<T>(x: Fn0<Promise<T>>): Promise<Result<T>>;
export function attempt<T>(x: Promise<T>): Promise<Result<T>>;
export function attempt<T>(x: Fn0<T | Promise<T>> | Promise<T>): Result<T> | Promise<Result<T>> {
    if (typeof x === "function") {
        const result = fromTry(x);
        if (isOk(result)) {
            if (result.value instanceof Promise) {
                return fromPromise(result.value);
            }
            return ok(result.value);
        }
        return result;
    }
    if (x instanceof Promise) {
        return fromPromise(x);
    }
    return err(new Error("Attempted to call a non-function or non-promise value"));
}

/**
 * Ensures that a value is not null or undefined, throwing an error if it is.
 *
 * @template T - Type of the value
 * @param value - The value to check
 * @param errorMessage - Custom error message to throw if the value is null or undefined
 * @returns The value if it's not null or undefined
 * @throws Error if the value is null or undefined
 */
export function must<T>(value: T | undefined | null, errorMessage = "Value is undefined or null"): T {
    if (value == null) {
        throw new Error(errorMessage);
    }
    return value;
}

/**
 * Ensures that a value is not undefined, throwing an error if it is.
 * Unlike `must`, this function allows null values to pass through.
 *
 * @template T - Type of the value
 * @param value - The value to check
 * @param errorMessage - Custom error message to throw if the value is undefined
 * @returns The value if it's not undefined
 * @throws Error if the value is undefined
 */
export function strictMust<T>(value: T | undefined, errorMessage = "Value is undefined"): T {
    if (value === undefined) {
        throw new Error(errorMessage);
    }
    return value;
}

/**
 * Asserts that a condition is truthy, throwing an error if it is not.
 *
 * @template T - Type of the condition
 * @param cond - The condition to check
 * @param message - Custom error message to throw if the condition is falsy
 * @throws Error if the condition is falsy
 */
export function assert<T>(cond: T, message: string = "Assertion failed"): asserts cond {
    if (!cond) {
        throw new Error(message);
    }
}

/**
 * Used for exhaustiveness checking in TypeScript.
 * This function should never be called during normal execution.
 * When used in switch-case statements with TypeScript's discriminated unions,
 * it ensures all possible cases are handled at compile-time.
 *
 * @param value - A value that should be of type 'never'
 * @returns Never returns as this function always throws
 * @throws Error indicating an unhandled value was encountered
 */
export function assertNever(value: never): never {
    throw new Error(`Unhandled value: ${value}`);
}
