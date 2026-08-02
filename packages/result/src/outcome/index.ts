import { isNone, isSome, Maybe, None, some, Some } from "~/maybe";
import { err, Err, isErr, isOk, ok, Ok, Result } from "~/result";

export type Outcome<V, E> = Maybe<Result<V, E>>;

export type Pending = None;
export type Done<V, E> = Some<Result<V, E>>;
export type Success<V> = Some<Ok<V>>;
export type Failure<E> = Some<Err<E>>;

export interface OutcomeMatch<V, E, T> {
    pending: () => T;
    success: (value: V) => T;
    failure: (error: E) => T;
}

export function isPending<V, E>(outcome: Outcome<V, E>): outcome is Pending {
    return isNone(outcome);
}

export function isDone<V, E>(outcome: Outcome<V, E>): outcome is Done<V, E> {
    return isSome(outcome);
}

export function isSuccess<V, E>(outcome: Outcome<V, E>): outcome is Success<V> {
    return isSome(outcome) && isOk(outcome.value);
}

export function isFailure<V, E>(outcome: Outcome<V, E>): outcome is Failure<E> {
    return isSome(outcome) && isErr(outcome.value);
}

export function success<V>(value: V): Success<V> {
    return some(ok(value));
}

export function failure<E>(error: E): Failure<E> {
    return some(err(error));
}
