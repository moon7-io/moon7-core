import { Future, FutureMatch, of } from "~/future";
import { all, FutureTuple } from "~/future/util";
import { Maybe, None, isNone, isSome } from "~/maybe";
import { Result, isOk } from "~/result";
import { Fn, Fn1, Predicate } from "~/util/types";

export function match<V, E, T>(future: Future<V, E>, patterns: FutureMatch<V, E, T>): T {
    const state = future();
    return isNone(state)
        ? patterns.awaiting()
        : isOk(state.value)
          ? patterns.resolve(state.value.value)
          : patterns.reject(state.value.error);
}

export function toPromise<T>(future: Future<T, unknown>): Promise<T> {
    return new Promise<T>((resolve, reject) =>
        future(result => (isOk(result) ? resolve(result.value) : reject(result.error)))
    );
}

export function unwrap<V, E>(future: Future<V, E>): V {
    const state = future();
    if (isSome(state)) {
        if (isOk(state.value)) {
            return state.value.value;
        }
        throw state.value.error;
    }
    throw new Error("Future is not completed");
}

export function unwrapOr<V, E>(future: Future<V, E>): V | undefined;
export function unwrapOr<V, E>(future: Future<V, E>, defaultValue: V): V;
export function unwrapOr<V, E>(future: Future<V, E>, defaultValue?: V): V | undefined {
    const state = future();
    return isSome(state) && isOk(state.value) ? state.value.value : defaultValue;
}

export function unwrapOrElse<V, E>(future: Future<V, E>, fn: Fn1<Maybe<Result<V, E>>, V>): V {
    const state = future();
    return isSome(state) && isOk(state.value) ? state.value.value : fn(state);
}

export function recover<V, E>(future: Future<V, E>, fn: Fn1<E, V>): Future<V, None> {
    return of(pass => future(result => (isOk(result) ? pass(result.value) : pass(fn(result.error)))));
}

export function map<V, E, U>(future: Future<V, E>, fn: Fn1<V, U>): Future<U, E> {
    return of((pass, fail) => future(result => (isOk(result) ? pass(fn(result.value)) : fail(result.error))));
}

export function mapError<V, E, U>(future: Future<V, E>, fn: Fn1<E, U>): Future<V, U> {
    return of((pass, fail) => future(result => (isOk(result) ? pass(result.value) : fail(fn(result.error)))));
}

export function bimap<V, E, U, T>(future: Future<V, E>, thenFn: Fn1<V, U>, catchFn: Fn1<E, T>): Future<U, T> {
    return of((pass, fail) =>
        future(result => (isOk(result) ? pass(thenFn(result.value)) : fail(catchFn(result.error))))
    );
}

export function chain<V, U, E>(future: Future<V, E>, fn: Fn1<V, Future<U, E>>): Future<U, E> {
    return of((pass, fail) =>
        future(result =>
            isOk(result)
                ? fn(result.value)(result => (isOk(result) ? pass(result.value) : fail(result.error)))
                : fail(result.error)
        )
    );
}

export function chainError<V, U, E>(future: Future<V, E>, fn: Fn1<E, Future<V, U>>): Future<V, U> {
    return of((pass, fail) =>
        future(result =>
            isOk(result)
                ? pass(result.value)
                : fn(result.error)(result => (isOk(result) ? pass(result.value) : fail(result.error)))
        )
    );
}

export function tap<V, U, E>(future: Future<V, E>, fn: Fn1<V, Future<U, E>>): Future<V, E> {
    return of((pass, fail) =>
        future(result =>
            isOk(result) ? fn(result.value)(r => (isOk(r) ? pass(result.value) : fail(r.error))) : fail(result.error)
        )
    );
}

export function tapError<V, U, E>(future: Future<V, E>, fn: Fn1<E, Future<V, U>>): Future<V, E> {
    return of((pass, fail) =>
        future(result =>
            isOk(result) ? pass(result.value) : fn(result.error)(r => (isOk(r) ? pass(r.value) : fail(result.error)))
        )
    );
}

export function filter<V, E>(future: Future<V, E>, cond: Predicate<V>): Future<V, void> {
    return of((pass, fail) => future(result => (isOk(result) && cond(result.value) ? pass(result.value) : fail())));
}

export function filterError<V, E>(future: Future<V, E>, cond: Predicate<E>): Future<void, E> {
    return of((pass, fail) => future(result => (isOk(result) || !cond(result.error) ? pass() : fail(result.error))));
}

export function apply<A extends any[], R, E>(fn: Future<Fn<A, R>, E>, ...args: FutureTuple<A, E>): Future<R, E> {
    return chain(fn, fn => map(all(...args), args => fn(...(args as A))));
}

export function join<V, E>(future: Future<Future<V, E>, E>): Future<V, E> {
    return of((pass, fail) =>
        future(result =>
            isOk(result)
                ? result.value(result => (isOk(result) ? pass(result.value) : fail(result.error)))
                : fail(result.error)
        )
    );
}

export function swap<V, E>(future: Future<V, E>): Future<E, V> {
    return of((pass, fail) => future(result => (isOk(result) ? fail(result.value) : pass(result.error))));
}
