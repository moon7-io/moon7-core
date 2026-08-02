import { isSome, Maybe, MaybeMatch, none, Some, some } from "~/maybe";
import { all, MaybeTuple } from "~/maybe/util";
import { Fn, Fn1, Predicate } from "~/util/types";

export function match<V, T>(maybe: Maybe<V>, patterns: MaybeMatch<V, T>): T {
    return isSome(maybe) ? patterns.some(maybe.value) : patterns.none();
}

export function unwrap<V>(maybe: Maybe<V>): V {
    if (isSome(maybe)) {
        return maybe.value;
    }
    throw none;
}

export function unwrapOr<V>(maybe: Maybe<V>): V | undefined;
export function unwrapOr<V>(maybe: Maybe<V>, defaultValue: V): V;
export function unwrapOr<V>(maybe: Maybe<V>, defaultValue?: V): V | undefined {
    return isSome(maybe) ? maybe.value : defaultValue;
}

export function unwrapOrElse<V>(maybe: Maybe<V>, fn: Fn1<void, V>): V {
    return isSome(maybe) ? maybe.value : fn();
}

export function recover<V>(maybe: Maybe<V>, fn: Fn1<void, V>): Some<V> {
    return isSome(maybe) ? maybe : some(fn());
}

export function map<V, U>(maybe: Maybe<V>, fn: Fn1<V, U>): Maybe<U> {
    return isSome(maybe) ? some(fn(maybe.value)) : none;
}

export function chain<V, U>(maybe: Maybe<V>, fn: Fn1<V, Maybe<U>>): Maybe<U> {
    return isSome(maybe) ? fn(maybe.value) : none;
}

export function tap<V, U>(result: Maybe<V>, fn: Fn1<V, Maybe<U>>): Maybe<V> {
    return isSome(result) ? chain(fn(result.value), () => result) : result;
}

export function filter<V>(maybe: Maybe<V>, cond: Predicate<V>): Maybe<V> {
    return isSome(maybe) && cond(maybe.value) ? maybe : none;
}

export function apply<A extends any[], R>(fn: Maybe<Fn<A, R>>, ...args: MaybeTuple<A>): Maybe<R> {
    return chain(fn, fn => map(all(...args), args => fn(...(args as A))));
}

export function join<V>(maybe: Maybe<Maybe<V>>): Maybe<V> {
    return isSome(maybe) ? maybe.value : maybe;
}
