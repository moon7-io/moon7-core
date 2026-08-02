import { describe, test, expect } from "vitest";
import { Result, isResult, isOk, isErr, ok, err } from "~/index";

describe("Result", () => {
    describe("isResult", () => {
        test("should return true for Ok variant", () => {
            const result = ok(42);
            expect(isResult(result)).toBe(true);
        });

        test("should return true for Err variant", () => {
            const result = err("error");
            expect(isResult(result)).toBe(true);
        });

        test("should return false for null", () => {
            expect(isResult(null)).toBe(false);
        });

        test("should return false for undefined", () => {
            expect(isResult(undefined)).toBe(false);
        });

        test("should return false for objects that are not Results", () => {
            expect(isResult({ foo: "bar" })).toBe(false);
            expect(isResult({ status: "other" })).toBe(false);
        });
    });

    describe("isOk", () => {
        test("should return true for Ok variant", () => {
            const result: Result<number, string> = ok(42);
            expect(isOk(result)).toBe(true);
        });

        test("should return false for Err variant", () => {
            const result: Result<number, string> = err("error");
            expect(isOk(result)).toBe(false);
        });

        test("should return false for null and undefined", () => {
            expect(isOk(null as unknown as Result<unknown, unknown>)).toBe(false);
            expect(isOk(undefined as unknown as Result<unknown, unknown>)).toBe(false);
        });

        test("should return false for non-Result objects", () => {
            expect(isOk({} as unknown as Result<unknown, unknown>)).toBe(false);
            expect(isOk({ status: "other" } as unknown as Result<unknown, unknown>)).toBe(false);
        });
    });

    describe("isErr", () => {
        test("should return true for Err variant", () => {
            const result: Result<number, string> = err("error");
            expect(isErr(result)).toBe(true);
        });

        test("should return false for Ok variant", () => {
            const result: Result<number, string> = ok(42);
            expect(isErr(result)).toBe(false);
        });

        test("should return false for null and undefined", () => {
            expect(isErr(null as unknown as Result<unknown, unknown>)).toBe(false);
            expect(isErr(undefined as unknown as Result<unknown, unknown>)).toBe(false);
        });

        test("should return false for non-Result objects", () => {
            expect(isErr({} as unknown as Result<unknown, unknown>)).toBe(false);
            expect(isErr({ status: "other" } as unknown as Result<unknown, unknown>)).toBe(false);
        });
    });

    describe("ok", () => {
        test("should create an Ok variant with the given value", () => {
            const result = ok(42);
            expect(result.status).toBe("ok");
            expect(result.value).toBe(42);
        });

        test("should work with complex values", () => {
            const obj = { foo: "bar" };
            const result = ok(obj);
            expect(result.status).toBe("ok");
            expect(result.value).toBe(obj);
        });

        test("should work with undefined and null values", () => {
            expect(ok(undefined).value).toBeUndefined();
            expect(ok(null).value).toBeNull();
        });
    });

    describe("err", () => {
        test("should create an Err variant with the given error", () => {
            const result = err("error message");
            expect(result.status).toBe("error");
            expect(result.error).toBe("error message");
        });

        test("should work with complex error objects", () => {
            const errorObj = new Error("Something went wrong");
            const result = err(errorObj);
            expect(result.status).toBe("error");
            expect(result.error).toBe(errorObj);
        });

        test("should work with undefined and null errors", () => {
            expect(err(undefined).error).toBeUndefined();
            expect(err(null).error).toBeNull();
        });
    });
});
