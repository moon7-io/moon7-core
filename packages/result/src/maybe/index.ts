export type Maybe<T> = Some<T> | None;

export interface Some<T> {
    readonly value: T;
}

export type None = undefined | null;

export interface MaybeMatch<V, T> {
    some: (value: V) => T;
    none: () => T;
}

export function isMaybe<T>(maybe: unknown): maybe is Maybe<T> {
    return isSome(maybe as any) || isNone(maybe as any);
}

export function isSome<T>(maybe: Maybe<T>): maybe is Some<T> {
    return maybe != null && typeof maybe === "object" && "value" in maybe;
}

export function isNone<T>(maybe: Maybe<T>): maybe is None {
    return maybe == null;
}

export function some<T>(value: T): Some<T> {
    return { value };
}

export const none: None = null;
