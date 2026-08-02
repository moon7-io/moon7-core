import { map } from "./methods";
import { adapt, Callback } from "~/callback";
import { Either, isRight } from "~/either";
import { isSome, Maybe, none, some } from "~/maybe";
import { Fn } from "~/util/types";

export function fromTry<V>(fn: () => V): Maybe<V> {
    try {
        return some<V>(fn());
    } catch (_) {
        return none;
    }
}

export async function fromTryAsync<V>(fn: () => Promise<V> | V): Promise<Maybe<V>> {
    try {
        return some<V>(await fn());
    } catch (_) {
        return none;
    }
}

export async function fromPromise<V>(promise: Promise<V>): Promise<Maybe<V>> {
    try {
        return some<V>(await promise);
    } catch (_) {
        return none;
    }
}

export function fromNullable<V>(value: V | null | undefined): Maybe<V> {
    return value != null ? some(value) : none;
}

export function fromCallback<V>(fn: (callback: Callback<V, unknown>) => void): Promise<Maybe<V>> {
    return new Promise<Maybe<V>>(resolve => fn(adapt(resolve)(some, () => none)));
}

export function fromEither<V, E>(either: Either<E, V>): Maybe<V> {
    return isRight(either) ? some(either[1]) : none;
}

export function all<V>(...many: Maybe<V>[]): Maybe<V[]> {
    const values: V[] = [];
    for (const item of many) {
        if (!isSome(item)) {
            return item;
        }
        values.push(item.value);
    }
    return some(values);
}

export function any<V>(...many: Maybe<V>[]): Maybe<V> {
    for (const item of many) {
        if (isSome(item)) {
            return item;
        }
    }
    return none;
}

export type LiftedMaybe<A extends any[], B> = (...results: MaybeTuple<A>) => Maybe<B>;
export type MaybeTuple<A extends any[]> = { [K in keyof A]: Maybe<A[K]> };

export function lift<A extends any[], B>(fn: Fn<A, B>): LiftedMaybe<A, B> {
    return (...results) => map(all(...results), args => fn(...(args as A)));
}
