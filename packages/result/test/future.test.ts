import { expect, test, describe } from "vitest";
import { Future, isFuture, of } from "~/future";
import { isNone, isSome } from "~/maybe";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe.skip("Future", () => {
    test("basic usage", async () => {
        function doSomething(): Future<string, Error> {
            return of(pass => {
                console.log("Doing something...");
                setTimeout(() => {
                    console.log("Done!");
                    pass("ok");
                }, 1000);
            });
        }

        const future = doSomething();

        future(result => {
            console.log("Callback A called with value:", result);
        });

        future(result => {
            console.log("Callback B called with value:", result);
        });

        expect(isNone(future())).toBe(true);

        await sleep(2000);

        future(result => {
            console.log("Callback C called with value:", result);
        });

        expect(isSome(future())).toBe(true);

        // TODO:
        // map(
        //     future,
        //     value => value.length * 2
        // )(result => {
        //     console.log("Callback D called with value:", result);
        // });

        expect(isFuture(future)).toBe(true);
    });
});
