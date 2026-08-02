import { Maybe, MaybeMatch, Some } from "~/maybe";
import * as M from "~/maybe/methods";
import { MaybeTuple } from "~/maybe/util";
import { Fn, Fn1, Predicate } from "~/util/types";

export type MaybeFn<V, T> = (result: Maybe<V>) => T;

export function match<V, T>(patterns: MaybeMatch<V, T>): MaybeFn<V, T> {
    return maybe => M.match(maybe, patterns);
}

export function unwrap<V>(): MaybeFn<V, V> {
    return maybe => M.unwrap(maybe);
}

export function unwrapOr<V>(): MaybeFn<V, V | undefined>;
export function unwrapOr<V>(defaultValue: V): MaybeFn<V, V>;
export function unwrapOr<V>(defaultValue?: V): MaybeFn<V, V | undefined> {
    return maybe => M.unwrapOr(maybe, defaultValue);
}

export function unwrapOrElse<V>(fn: Fn1<void, V>): MaybeFn<V, V> {
    return maybe => M.unwrapOrElse(maybe, fn);
}

export function recover<V>(fn: Fn1<void, V>): MaybeFn<V, Some<V>> {
    return maybe => M.recover(maybe, fn);
}

export function map<V, U>(fn: (value: V) => U): MaybeFn<V, Maybe<U>> {
    return maybe => M.map(maybe, fn);
}

export function chain<V, U>(fn: (value: V) => Maybe<U>): MaybeFn<V, Maybe<U>> {
    return maybe => M.chain(maybe, fn);
}

export function tap<V, U>(fn: Fn1<V, Maybe<U>>): MaybeFn<V, Maybe<V>> {
    return maybe => M.tap(maybe, fn);
}

export function filter<V>(cond: Predicate<V>): MaybeFn<V, Maybe<V>> {
    return maybe => M.filter(maybe, cond);
}

export function apply<A extends any[], R>(...args: MaybeTuple<A>): MaybeFn<Fn<A, R>, Maybe<R>> {
    return fn => M.apply(fn, ...args);
}

export function join<V>(): MaybeFn<Maybe<V>, Maybe<V>> {
    return maybe => M.join(maybe);
}
