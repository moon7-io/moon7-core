import { map } from "./methods";
import { Callback } from "~/callback";
import { Either, isRight } from "~/either";
import { Future, of } from "~/future";
import { None } from "~/maybe";
import { isOk } from "~/result";
import { Fn } from "~/util/types";

export function fromTry<V, E>(fn: () => V): Future<V, E> {
    return of((pass, fail) => {
        try {
            pass(fn());
        } catch (error) {
            fail(error as E);
        }
    });
}

export function fromTryAsync<V, E>(fn: () => Promise<V> | V): Future<V, E> {
    return of(async (pass, fail) => {
        try {
            pass(await fn());
        } catch (error) {
            fail(error as E);
        }
    });
}

export function fromPromise<V, E>(promise: Promise<V>): Future<V, E> {
    return of(async (pass, fail) => {
        try {
            pass(await promise);
        } catch (error) {
            fail(error as E);
        }
    });
}

export function fromNullable<V>(value: V | null | undefined): Future<V, None>;
export function fromNullable<V, E>(value: V | null | undefined, error: E): Future<V, E>;
export function fromNullable<V, E>(value: V | null | undefined, error?: E): Future<V, E | None> {
    return of((pass, fail) => (value != null ? pass(value) : fail(error)));
}

export function fromCallback<V, E>(fn: (callback: Callback<V, E>) => void): Future<V, E> {
    return of((pass, fail) => fn((...either) => (isRight(either) ? pass(either[1]) : fail(either[0]))));
}

export function fromEither<V, E>(either: Either<E, V>): Future<V, E> {
    return of((pass, fail) => (isRight(either) ? pass(either[1]) : fail(either[0])));
}

export function all<V, E>(...many: Future<V, E>[]): Future<V[], E> {
    return of((pass, fail) => {
        if (many.length === 0) return pass([]);
        const values: V[] = [];
        let count = 0;
        many.forEach((future, i) => {
            future(result => {
                count++;
                if (isOk(result)) {
                    values[i] = result.value;
                    if (count === many.length) {
                        pass(values);
                    }
                } else {
                    fail(result.error);
                }
            });
        });
    });
}

export function any<V, E>(...many: Future<V, E>[]): Future<V, E[]> {
    return of((pass, fail) => {
        if (many.length === 0) return fail([]);
        const errors: E[] = [];
        let count = 0;
        many.forEach((future, i) => {
            future(result => {
                count++;
                if (!isOk(result)) {
                    errors[i] = result.error;
                    if (count === many.length) {
                        fail(errors);
                    }
                } else {
                    pass(result.value);
                }
            });
        });
    });
}

export type LiftedFuture<A extends any[], B, E> = (...results: FutureTuple<A, E>) => Future<B, E>;
export type FutureTuple<A extends any[], E> = { [K in keyof A]: Future<A[K], E> };

export function lift<A extends any[], B, E>(fn: Fn<A, B>): LiftedFuture<A, B, E> {
    return (...results) => map(all(...results), args => fn(...(args as A)));
}
