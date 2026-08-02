import { none, some } from "~/maybe";
import { Done, Failure, isDone, isFailure, isPending, isSuccess, Outcome, Pending, Success } from "~/outcome";
import { Result, ok, err, Ok, Err } from "~/result";

const symbol = Symbol("future");

export interface Future<V, E> {
    (): Outcome<V, E>;
    (cb: FutureCallback<V, E>): void;
    [symbol]: true;
}

export interface Awaiting<V, E> {
    (): Pending;
    (cb: FutureCallback<V, E>): void;
    [symbol]: true;
}

export interface Completed<V, E> {
    (): Done<V, E>;
    (cb: FutureCallback<V, E>): void;
    [symbol]: true;
}

export interface Resolved<V> {
    (): Success<V>;
    (cb: (result: Ok<V>) => void): void;
    [symbol]: true;
}

export interface Rejected<E> {
    (): Failure<E>;
    (cb: (result: Err<E>) => void): void;
    [symbol]: true;
}

export type FutureCallback<V, E> = (result: Result<V, E>) => void;

export type FutureInit<V, E> = (resolve: (value: V) => void, reject: (error: E) => void) => void;

export interface FutureMatch<V, E, T> {
    awaiting: () => T;
    completed: (result: Result<V, E>) => T;
    resolve: (value: V) => T;
    reject: (error: E) => T;
}

export function of<V, E = unknown>(init: FutureInit<V, E>): Future<V, E> {
    let outcome: Outcome<V, E> = none;
    const listeners: FutureCallback<V, E>[] = [];

    const resolve = (value: V) => {
        if (isDone(outcome)) return;
        const result = ok(value);
        outcome = some(result);
        listeners.forEach(cb => cb(result));
        listeners.length = 0;
    };

    const reject = (error: E) => {
        if (isDone(outcome)) return;
        const result = err(error);
        outcome = some(result);
        listeners.forEach(cb => cb(result));
        listeners.length = 0;
    };

    init(resolve, reject);

    const fn: Future<V, E> = (cb => {
        // no callback provided -> return the current state
        if (cb == null) {
            return outcome;
        }
        // already done -> call the callback immediately
        if (isDone(outcome)) {
            return cb(outcome.value);
        }
        // otherwise, add the callback to the listeners
        listeners.push(cb);
    }) as Future<V, E>;

    fn[symbol] = true;
    return fn;
}

export function isFuture<V, E>(future: unknown): future is Future<V, E> {
    return typeof future === "function" && symbol in future;
}

export function isCompleted<V, E>(future: Future<V, E>): future is Completed<V, E> {
    return isDone(future());
}

export function isAwaiting<V, E>(future: Future<V, E>): future is Awaiting<V, E> {
    return isPending(future());
}

export function isResolved<V, E>(future: Future<V, E>): future is Resolved<V> {
    return isSuccess(future());
}

export function isRejected<V, E>(future: Future<V, E>): future is Rejected<E> {
    return isFailure(future());
}

export function resolve<V>(value: V): Resolved<V> {
    return of(pass => pass(value)) as Resolved<V>;
}

export function reject<E>(error: E): Rejected<E> {
    return of((pass, fail) => fail(error)) as Rejected<E>;
}
