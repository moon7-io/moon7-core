import { Either, EitherMatch, Right } from "~/either";
import * as E from "~/either/methods";
import { EitherTuple } from "~/either/util";
import { None } from "~/maybe";
import { Fn, Fn1, Predicate } from "~/util/types";

export type EitherFn<E, V, T> = (result: Either<E, V>) => T;

export function match<L, R, T>(patterns: EitherMatch<L, R, T>): EitherFn<L, R, T> {
    return either => E.match(either, patterns);
}

export function unwrap<L, R>(): EitherFn<L, R, R> {
    return either => E.unwrap(either);
}

export function unwrapOr<L, R>(): EitherFn<L, R, R | undefined>;
export function unwrapOr<L, R>(defaultValue: R): EitherFn<L, R, R>;
export function unwrapOr<L, R>(defaultValue?: R): EitherFn<L, R, R | undefined> {
    return either => E.unwrapOr(either, defaultValue);
}

export function unwrapOrElse<L, R>(fn: Fn1<L, R>): EitherFn<L, R, R> {
    return either => E.unwrapOrElse(either, fn);
}

export function recover<L, R>(fn: Fn1<L, R>): EitherFn<L, R, Right<R>> {
    return either => E.recover(either, fn);
}

export function map<L, R, U>(fn: Fn1<R, U>): EitherFn<L, R, Either<L, U>> {
    return either => E.map(either, fn);
}

export function mapLeft<L, R, U>(fn: Fn1<L, U>): EitherFn<L, R, Either<U, R>> {
    return either => E.mapLeft(either, fn);
}

export function bimap<L, R, U, V>(leftFn: Fn1<L, U>, rightFn: Fn1<R, V>): EitherFn<L, R, Either<U, V>> {
    return either => E.bimap(either, leftFn, rightFn);
}

export function chain<L, R, U>(fn: Fn1<R, Either<L, U>>): EitherFn<L, R, Either<L, U>> {
    return either => E.chain(either, fn);
}

export function chainLeft<L, R, U>(fn: Fn1<L, Either<U, R>>): EitherFn<L, R, Either<U, R>> {
    return either => E.chainLeft(either, fn);
}

export function tap<L, R, U>(fn: Fn1<R, Either<L, U>>): EitherFn<L, R, Either<L, R>> {
    return either => E.tap(either, fn);
}

export function tapLeft<L, R, U>(fn: Fn1<L, Either<U, R>>): EitherFn<L, R, Either<L, R>> {
    return either => E.tapLeft(either, fn);
}

export function filter<L, R>(cond: Predicate<R>): EitherFn<L, R, Either<None, R>> {
    return either => E.filter(either, cond);
}

export function filterLeft<L, R>(cond: Predicate<L>): EitherFn<L, R, Either<L, None>> {
    return either => E.filterLeft(either, cond);
}

export function apply<A extends any[], R, E>(...args: EitherTuple<E, A>): EitherFn<E, Fn<A, R>, Either<E, R>> {
    return fn => E.apply(fn, ...args);
}

export function join<L, R>(): EitherFn<L, Either<L, R>, Either<L, R>> {
    return either => E.join(either);
}

export function swap<L, R>(): EitherFn<L, R, Either<R, L>> {
    return either => E.swap(either);
}
