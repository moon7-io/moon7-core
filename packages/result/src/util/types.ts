// export type Recover<V, E> = (error: E) => V;
export type Fn<A extends any[] = any[], R = any> = (...args: A) => R;
export type Fn0<R> = () => R;
export type Fn1<A = any, R = any> = (a: A) => R;

export type Predicate<T> = (value: T) => boolean;
// export type Fn1<T, U> = (value: T) => U;
