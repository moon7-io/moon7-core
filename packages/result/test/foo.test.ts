import { expect, test, describe } from "vitest";
import { ok, Result } from "~/result";
import { chain, map } from "~/result/methods";
import { all, lift, ResultTuple } from "~/result/util";

function addNumbers(a: number, b: number, c: number): number {
    return a + b + c;
}

function ap<A extends any[], R, E>(fn: Result<(...args: A) => R, E>, ...args: ResultTuple<A, E>): Result<R, E> {
    return chain(fn, fn => map(all(...args), args => fn(...(args as A))));
}

describe.skip("apply", () => {
    test("lift", () => {
        const rAddNumbers = lift(addNumbers);
        const x = rAddNumbers(ok(2), ok(3), ok(4));

        expect(x).toStrictEqual(ok(9));
    });

    test("apply", () => {
        const rAddNumbers = ok(addNumbers);
        const x = ap(rAddNumbers, ok(2), ok(1), ok(1));

        expect(x).toStrictEqual(ok(4));
    });
});
