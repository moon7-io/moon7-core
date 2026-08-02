import { Either, EitherMatch, isLeft, isRight, left, Right, right } from "~/either";
import { all, EitherTuple } from "~/either/util";
import { None } from "~/maybe";
import { Fn, Fn1, Predicate } from "~/util/types";

export function match<L, R, T>(either: Either<L, R>, patterns: EitherMatch<L, R, T>): T {
    return isRight(either) ? patterns.right(either[1]) : patterns.left(either[0]);
}

export function unwrap<L, R>(either: Either<L, R>): R {
    if (isRight(either)) {
        return either[1];
    }
    throw either[0];
}

export function unwrapOr<L, R>(either: Either<L, R>): R | undefined;
export function unwrapOr<L, R>(either: Either<L, R>, defaultValue: R): R;
export function unwrapOr<L, R>(either: Either<L, R>, defaultValue?: R): R | undefined {
    return isRight(either) ? either[1] : defaultValue;
}

export function unwrapOrElse<L, R>(either: Either<L, R>, fn: Fn1<L, R>): R {
    return isRight(either) ? either[1] : fn(either[0]);
}

export function recover<L, R>(either: Either<L, R>, fn: Fn1<L, R>): Right<R> {
    return isRight(either) ? either : right(fn(either[0]));
}

export function map<L, R, U>(either: Either<L, R>, fn: Fn1<R, U>): Either<L, U> {
    return isRight(either) ? right(fn(either[1])) : left(either[0]);
}

export function mapLeft<L, R, U>(either: Either<L, R>, fn: Fn1<L, U>): Either<U, R> {
    return isLeft(either) ? left(fn(either[0])) : right(either[1]);
}

export function bimap<L, R, U, V>(either: Either<L, R>, leftFn: Fn1<L, U>, rightFn: Fn1<R, V>): Either<U, V> {
    return isRight(either) ? right(rightFn(either[1])) : left(leftFn(either[0]));
}

export function chain<L, R, U>(either: Either<L, R>, fn: Fn1<R, Either<L, U>>): Either<L, U> {
    return isRight(either) ? fn(either[1]) : left(either[0]);
}

export function chainLeft<L, R, U>(either: Either<L, R>, fn: Fn1<L, Either<U, R>>): Either<U, R> {
    return isLeft(either) ? fn(either[0]) : right(either[1]);
}

export function tap<L, R, U>(either: Either<L, R>, fn: Fn1<R, Either<L, U>>): Either<L, R> {
    return isRight(either) ? chain(fn(either[1]), () => either) : either;
}

export function tapLeft<L, R, U>(either: Either<L, R>, fn: Fn1<L, Either<U, R>>): Either<L, R> {
    return isLeft(either) ? chainLeft(fn(either[0]), () => either) : either;
}

export function filter<L, R>(either: Either<L, R>, cond: Predicate<R>): Either<None, R> {
    return isRight(either) && cond(either[1]) ? either : left(undefined);
}

export function filterLeft<L, R>(either: Either<L, R>, cond: Predicate<L>): Either<L, None> {
    return isLeft(either) && cond(either[0]) ? either : right(undefined);
}

export function apply<A extends any[], R, E>(fn: Either<E, Fn<A, R>>, ...args: EitherTuple<E, A>): Either<E, R> {
    return chain(fn, fn => map(all(...args), args => fn(...(args as A))));
}

export function join<L, R>(either: Either<L, Either<L, R>>): Either<L, R> {
    return isRight(either) ? either[1] : either;
}

export function swap<L, R>(either: Either<L, R>): Either<R, L> {
    return isRight(either) ? left(either[1]) : right(either[0]);
}
