import { adapt, Callback } from "~/callback";
import { Maybe, none, some } from "~/maybe";
import { err, ok, Result } from "~/result";

/**
 * Converts a Result-accepting callback to a Node.js-style callback.
 *
 * Allows functions expecting Node.js callbacks to work with Result types instead:
 * ```
 * // Standard Node.js callback
 * readFile("/path/to/file", (error, value) => console.log(value));
 *
 * // Using Result type instead
 * readFile("/path/to/file", result(result => console.log(result)));
 * ```
 *
 * @template V - Value type (success case)
 * @template E - Error type (failure case)
 * @param cb - Callback accepting a Result object
 * @returns A Node.js-style callback function
 */
export function result<V, E>(cb: (result: Result<V, E>) => void): Callback<V, E> {
    return adapt(cb)(ok, err);
}

/**
 * Converts a Maybe-accepting callback to a Node.js-style callback.
 *
 * Similar to the result function, but works with Maybe types that
 * represent optional values rather than error/success pairs.
 *
 * @template V - Value type (Some case)
 * @template E - Error type (unused in Maybe but needed for Callback signature)
 * @param cb - Callback accepting a Maybe object
 * @returns A Node.js-style callback function
 */
export function maybe<V, E>(cb: (result: Maybe<V>) => void): Callback<V, E> {
    return adapt(cb)(some, () => none);
}
