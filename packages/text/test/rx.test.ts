import { expect, test, describe, vi } from "vitest";
import { regexp } from "~/RxTemplate";

describe("rx tagged template", () => {
    test("regexp basic", () => {
        const rx = regexp`?c
            foo ${123} abc // comment
            baz
        `;
        expect(rx.source).toBe("foo123abcbaz");
    });

    test("regexp with flags", () => {
        const rx = regexp`?gmc
            foo ${123} abc // comment
            baz
        `;
        expect(rx.source).toBe("foo123abcbaz");
        expect(rx.flags).toBe("gm");
    });

    test("regexp slashes", () => {
        expect(regexp`?c ^foo/bar`.test("foo/bar")).toBe(true);
        expect(regexp`?c ^foo/bar`.test("foobar")).toBe(false);

        expect(regexp`?c ^foo//bar$`.test("foo")).toBe(true);
        expect(regexp`?c ^foo//bar$`.test("foo/anything")).toBe(true);

        expect(regexp`?c ^foo\//bar$`.test("foo//bar")).toBe(true);
        expect(regexp`?c ^foo\//bar$`.test("foo/bar")).toBe(false);

        expect(regexp`?c ^foo\///bar$`.test("foo///bar")).toBe(true);
        expect(regexp`?c ^foo\////bar$`.test("foo////bar")).toBe(true);
        expect(regexp`?c ^foo\//////bar$`.test("foo//////bar")).toBe(true);
    });
});
