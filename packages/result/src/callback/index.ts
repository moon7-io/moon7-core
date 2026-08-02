import { type Either, isRight } from "~/either";

/**
 * A callback function that accepts an Either type result.
 *
 * @template V - Value type (success case)
 * @template E - Error type (failure case)
 */
export type Callback<V, E> = (...either: Either<E, V>) => void;

/**
 * Adapts between Node.js-style callbacks and other data types.
 *
 * Node.js callbacks typically follow the (error, value) => void pattern, which maps
 * naturally to Either's [error, value] structure when spread. This function
 * enables interoperability between this pattern and other monadic types.
 *
 * @template T - The target type to convert to
 * @param cb - Callback that accepts the converted result
 * @returns A function that configures transformations for Either values
 */
export function adapt<T>(cb: (result: T) => void) {
    return function <V, E>(pass: (value: V) => T, fail: (error: E) => T): Callback<V, E> {
        return (...either) => {
            if (isRight(either)) {
                cb(pass(either[1]));
            } else {
                cb(fail(either[0]));
            }
        };
    };
}
