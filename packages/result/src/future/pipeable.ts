import { Future, FutureMatch } from "~/future";
import * as F from "~/future/methods";
import { FutureTuple } from "~/future/util";
import { Maybe, None } from "~/maybe";
import { Result } from "~/result";
import { Fn, Fn1, Predicate } from "~/util/types";

export type FutureFn<V, E, T> = (result: Future<V, E>) => T;

export function match<V, E, T>(patterns: FutureMatch<V, E, T>): FutureFn<V, E, T> {
    return future => F.match(future, patterns);
}

export function toPromise<T>(): FutureFn<T, unknown, Promise<T>> {
    return future => F.toPromise(future);
}

export function unwrap<V, E>(): FutureFn<V, E, V> {
    return future => F.unwrap(future);
}

export function unwrapOr<V, E>(): FutureFn<V, E, V | undefined>;
export function unwrapOr<V, E>(defaultValue: V): FutureFn<V, E, V>;
export function unwrapOr<V, E>(defaultValue?: V): FutureFn<V, E, V | undefined> {
    return future => F.unwrapOr(future, defaultValue);
}

export function unwrapOrElse<V, E>(fn: Fn1<Maybe<Result<V, E>>, V>): FutureFn<V, E, V> {
    return future => F.unwrapOrElse(future, fn);
}

export function recover<V, E>(fn: Fn1<E, V>): FutureFn<V, E, Future<V, None>> {
    return future => F.recover(future, fn);
}

export function map<V, E, U>(fn: (value: V) => U): FutureFn<V, E, Future<U, E>> {
    return future => F.map(future, fn);
}

export function mapError<V, E, U>(fn: Fn1<E, U>): FutureFn<V, E, Future<V, U>> {
    return future => F.mapError(future, fn);
}

export function bimap<V, E, U, T>(thenFn: Fn1<V, U>, catchFn: Fn1<E, T>): FutureFn<V, E, Future<U, T>> {
    return future => F.bimap(future, thenFn, catchFn);
}

export function chain<V, U, E>(fn: (value: V) => Future<U, E>): FutureFn<V, E, Future<U, E>> {
    return future => F.chain(future, fn);
}

export function chainError<V, U, E>(fn: Fn1<E, Future<V, U>>): FutureFn<V, E, Future<V, U>> {
    return future => F.chainError(future, fn);
}

export function tap<V, U, E>(fn: Fn1<V, Future<U, E>>): FutureFn<V, E, Future<V, E>> {
    return future => F.tap(future, fn);
}

export function tapError<V, U, E>(fn: Fn1<E, Future<V, U>>): FutureFn<V, E, Future<V, E>> {
    return future => F.tapError(future, fn);
}

export function filter<V, E>(cond: Predicate<V>): FutureFn<V, E, Future<V, void>> {
    return future => F.filter(future, cond);
}

export function filterError<V, E>(cond: Predicate<E>): FutureFn<V, E, Future<void, E>> {
    return future => F.filterError(future, cond);
}

export function apply<A extends any[], R, E>(...args: FutureTuple<A, E>): FutureFn<Fn<A, R>, E, Future<R, E>> {
    return fn => F.apply(fn, ...args);
}

export function join<V, E>(): FutureFn<Future<V, E>, E, Future<V, E>> {
    return future => F.join(future);
}

export function swap<V, E>(): FutureFn<V, E, Future<E, V>> {
    return future => F.swap(future);
}
