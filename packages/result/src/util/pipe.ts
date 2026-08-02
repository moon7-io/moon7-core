import { Fn } from "./types";

type First<T extends Fn[]> = T extends [Fn<any, infer R>, ...any] ? R : never;

type Last<T extends Fn[]> = T extends [...any, Fn<any, infer R>] ? R : never;

type PipeArgs<A extends any[], T extends Fn[]> = T extends [Fn<any, infer R>, ...infer Rest]
    ? Rest extends [Fn, ...any]
        ? [Fn<A, R>, ...PipeArgs<[R], Rest>]
        : [Fn<A, R>]
    : T;

type ComposeArgs<A extends any[], T extends Fn[]> = T extends [...infer Rest, Fn<any, infer R>]
    ? Rest extends [...any, Fn]
        ? [...ComposeArgs<[R], Rest>, Fn<A, R>]
        : [Fn<A, R>]
    : T;

// tuple of types instead of tuple of functions
type Args<A extends any[], T extends any[]> = T extends [infer R, ...infer Rest]
    ? Rest extends [any, ...any]
        ? [Fn<A, R>, ...Args<[R], Rest>]
        : [Fn<A, R>]
    : T;

export interface Pipe {
    // support anonymous functions type inference
    <A>(x: A): A;
    <A, Z>(x: A, ...args: Args<[A], [Z]>): Z;
    <A, B, Z>(x: A, ...args: Args<[A], [B, Z]>): Z;
    <A, B, C, Z>(x: A, ...args: Args<[A], [B, C, Z]>): Z;
    <A, B, C, D, Z>(x: A, ...args: Args<[A], [B, C, D, Z]>): Z;
    <A, B, C, D, E, Z>(x: A, ...args: Args<[A], [B, C, D, E, Z]>): Z;
    <A, B, C, D, E, F, Z>(x: A, ...args: Args<[A], [B, C, D, E, F, Z]>): Z;
    <A, B, C, D, E, F, G, Z>(x: A, ...args: Args<[A], [B, C, D, E, F, G, Z]>): Z;
    <A, B, C, D, E, F, G, H, Z>(x: A, ...args: Args<[A], [B, C, D, E, F, G, H, Z]>): Z;

    // more than 8 args (functions must be typed -- inference doesn't work)
    <A, T extends Fn[]>(x: A, ...args: PipeArgs<[A], T>): Last<T>;
}

export interface Flow {
    // support anonymous functions type inference
    <A extends any[], Z>(...args: Args<A, [Z]>): Fn<A, Z>;
    <A extends any[], B, Z>(...args: Args<A, [B, Z]>): Fn<A, Z>;
    <A extends any[], B, C, Z>(...args: Args<A, [B, C, Z]>): Fn<A, Z>;
    <A extends any[], B, C, D, Z>(...args: Args<A, [B, C, D, Z]>): Fn<A, Z>;
    <A extends any[], B, C, D, E, Z>(...args: Args<A, [B, C, D, E, Z]>): Fn<A, Z>;
    <A extends any[], B, C, D, E, F, Z>(...args: Args<A, [B, C, D, E, F, Z]>): Fn<A, Z>;
    <A extends any[], B, C, D, E, F, G, Z>(...args: Args<A, [B, C, D, E, F, G, Z]>): Fn<A, Z>;
    <A extends any[], B, C, D, E, F, G, H, Z>(...args: Args<A, [B, C, D, E, F, G, H, Z]>): Fn<A, Z>;

    // more than 8 args (functions must be typed -- inference doesn't work)
    <A extends any[], T extends Fn[]>(...args: PipeArgs<A, T>): Fn<A, Last<T>>;
}

export interface Compose {
    <A extends any[], T extends Fn[]>(...args: ComposeArgs<A, T>): Fn<A, First<T>>;
}

export const flow: Flow = ((...fns: any[]) =>
    (x: any) =>
        fns.reduce((v, f) => f(v), x)) as any;

export const compose: Compose = ((...fns: any[]) =>
    (x: any) =>
        fns.reduceRight((v, f) => f(v), x)) as any;

export const pipe: Pipe = (x: any, ...fns: any[]) => fns.reduce((v, f) => f(v), x) as any;

// const multiToNum = (hey: number, foo: string, bar: Date): number => hey;
// const numToNum = (hey: number): number => hey;
// const numToDate = (x: number): Date => new Date(x);
// const dateToDate = (x: Date): Date => new Date(x);
// const dateToNum = (x: Date): number => x.valueOf();
// const dateToBool = (x: Date): boolean => x.valueOf() > 1000;
// const boolToStr = (x: boolean): string => x.toString();
// const strToDate = (x: string): Date => new Date();

// const r1 = pipe(numToNum, dateToBool); // err
// const p2 = flow(numToNum, numToDate, dateToBool); // ok
// const c2 = compose(dateToBool, numToDate, numToNum); // ok
// const r3 = pipe(3, numToNum, numToDate, dateToDate, dateToBool); // ok
// const r4 = pipe(dateToNum, numToDate, dateToDate, dateToBool, boolToStr); // ok
// const r5 = pipe(dateToNum, numToDate, dateToDate, numToNum, boolToStr); // err
// const r6 = pipe(dateToNum, strToDate, dateToDate, numToNum, boolToStr); // err
// const r7 = pipe(); // err

// const f8 = flow(
//     (a: number) => !!a,
//     b => (typeof b).slice(0),
//     c => new Date(c),
//     d => d.getTime()
// );

// r8(1, true);
