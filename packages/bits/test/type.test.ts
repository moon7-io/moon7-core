import { expect, test, describe } from "vitest";
import { ALL, NONE } from "~/index";

describe("Type", () => {
    describe("Constants", () => {
        test("ALL should have all bits set to 1", () => {
            expect(ALL).toBe(~0 >>> 0);
            expect(ALL).toBe(-1 >>> 0);
        });

        test("NONE should have all bits set to 0", () => {
            expect(NONE).toBe(0);
        });
    });
});
