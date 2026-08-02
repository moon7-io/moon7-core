import { map } from "./methods";
import { adapt, Callback } from "~/callback";
import { Either, isRight, left, right } from "~/either";
import { isOk, Result } from "~/result";
import { Fn } from "~/util/types";

export function fromTry<L, R>(fn: () => R): Either<L, R> {
    try {
        return right<R>(fn());
    } catch (error) {
        return left<L>(error as L);
    }
}

export async function fromTryAsync<L, R>(fn: () => Promise<R> | R): Promise<Either<L, R>> {
    try {
        return right<R>(await fn());
    } catch (error) {
        return left<L>(error as L);
    }
}

export async function fromPromise<L, R>(promise: Promise<R>): Promise<Either<L, R>> {
    try {
        return right<R>(await promise);
    } catch (error) {
        return left<L>(error as L);
    }
}

export function fromNullable<R>(value: R | null | undefined): Either<undefined, R>;
export function fromNullable<R, L>(value: R | null | undefined, error: L): Either<L, R>;
export function fromNullable<R, L>(value: R | null | undefined, error?: L): Either<L | undefined, R> {
    return value != null ? right(value) : left(error);
}

export function fromCallback<L, R>(fn: (callback: Callback<R, L>) => void): Promise<Either<L, R>> {
    return new Promise<Either<L, R>>(resolve => fn(adapt(resolve)(right, left)));
}

export function fromResult<L, R>(result: Result<R, L>): Either<L, R> {
    return isOk(result) ? right(result.value) : left(result.error);
}

export function all<L, R>(...many: Either<L, R>[]): Either<L, R[]> {
    const values: R[] = [];
    for (const item of many) {
        if (!isRight(item)) {
            return item;
        }
        values.push(item[1]);
    }
    return right(values);
}

export function any<L, R>(...many: Either<L, R>[]): Either<L[], R> {
    let errors: L[] = [];
    for (const item of many) {
        if (isRight(item)) {
            return item;
        }
        errors.push(item[0]);
    }
    return left(errors);
}

export type LiftedEither<A extends any[], B, E> = (...results: EitherTuple<E, A>) => Either<E, B>;
export type EitherTuple<E, A extends any[]> = { [K in keyof A]: Either<E, A[K]> };

export function lift<A extends any[], B, E>(fn: Fn<A, B>): LiftedEither<A, B, E> {
    return (...results) => map(all(...results), args => fn(...(args as A)));
}
