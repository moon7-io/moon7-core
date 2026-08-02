export type Left<L> = [error: L, value: undefined | null];
export type Right<R> = [error: undefined | null, value: R];
export type Either<L, R> = Left<L> | Right<R>;

export interface EitherMatch<L, R, T> {
    left: (error: L) => T;
    right: (value: R) => T;
}

export function isEither<L, R>(either: unknown): either is Either<L, R> {
    return isRight(either) || isLeft(either);
}

export function isRight<R>(either: unknown): either is Right<R> {
    return Array.isArray(either) && either.length >= 2 && either[0] == null;
}

export function isLeft<L>(either: unknown): either is Left<L> {
    return Array.isArray(either) && either.length >= 1 && either[0] != null;
}

export function right<R>(value: R): Right<R> {
    return [undefined, value];
}

export function left<L>(value: L): Left<L> {
    return [value, undefined];
}
