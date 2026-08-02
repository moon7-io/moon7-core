import { expect, test, describe } from "vitest";
import { Struct } from "~/Struct";

describe("struct", () => {
    test("get", () => {
        const obj = {
            foo: {
                bar: {
                    abc: {
                        hello: 123,
                    },
                },
            },
        };

        expect(Struct.get(obj, "foo")).toEqual({
            bar: {
                abc: {
                    hello: 123,
                },
            },
        });

        expect(Struct.get(obj, "foo.bar")).toEqual({
            abc: {
                hello: 123,
            },
        });

        expect(Struct.get(obj, "foo.bar.abc")).toEqual({
            hello: 123,
        });

        expect(Struct.get(obj, "foo.bar.abc.hello")).toBe(123);
    });

    test("Struct.stringify object should sort keys", () => {
        expect(Struct.stringify({ a: 1, b: 2 })).toBe('{"a":1,"b":2}');
        expect(Struct.stringify({ b: 2, a: 1 })).toBe('{"a":1,"b":2}');
    });

    test("Struct.stringify nested object should sort keys", () => {
        const ans = '{"a":1,"b":2,"x":{"p":3,"q":4}}';
        expect(Struct.stringify({ a: 1, x: { p: 3, q: 4 }, b: 2 })).toBe(ans);
        expect(Struct.stringify({ b: 2, x: { p: 3, q: 4 }, a: 1 })).toBe(ans);
        expect(Struct.stringify({ b: 2, x: { q: 4, p: 3 }, a: 1 })).toBe(ans);
        expect(Struct.stringify({ a: 1, x: { q: 4, p: 3 }, b: 2 })).toBe(ans);
        expect(Struct.stringify({ x: { q: 4, p: 3 }, b: 2, a: 1 })).toBe(ans);
    });

    test("Struct.stringify should otherwise be same as JSON.stringify", () => {
        const data = ["a", 2, false, null, 0.3];
        expect(Struct.stringify(data)).toBe(JSON.stringify(data));
    });
});
