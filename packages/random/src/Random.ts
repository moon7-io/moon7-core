/**
 * Seedable random number generator
 */
import { RangeArgs, getRangeArgs } from "./utils/Range";
import { SecureRandom } from "./SecureRandom";
import { type Seed, type PseudoRandomFn, PseudoRandom } from "./PseudoRandom";
import { float, int } from "./Types";

export const MAX_POS_INT32 = 0x7fffffff;

/** A random number generator function */
export type RandomFn = () => float;

export class Random {
    public readonly rng: RandomFn;

    public constructor(rng: RandomFn) {
        this.rng = rng;
    }

    /** Create a Random using sfc32 with string seed */
    public static seed(value: Seed, prng: PseudoRandomFn = PseudoRandom.sfc32): Random {
        return new Random(prng(value).nextFloat);
    }

    /** return a random int from [lo, hi) */
    public int(lo: int = 0, hi: int = MAX_POS_INT32) {
        return Math.floor(lo + this.rng() * (hi - lo));
    }

    /** return a random float from [lo, hi) */
    public float(lo: float = 0, hi: float = 1) {
        return lo + this.rng() * (hi - lo);
    }

    /** return a random boolean with true occurring at probability of p */
    public boolean(p: float) {
        return this.rng() < p;
    }

    /** return a random string of given length using given chars */
    public string(chars: string | ArrayLike<string>, length: int): string {
        return this.pick(chars, length).join("");
    }

    /** return a random index from an ArrayLike, or -1 if the length is 0 */
    public index<T>(array: ArrayLike<T>): int {
        if (array.length <= 0) {
            return -1;
        }
        return Math.floor(this.rng() * array.length);
    }

    /** pick a random element from an array */
    public choose<T>(array: ArrayLike<T>): T {
        if (array.length <= 0) {
            throw new Error("Array is empty");
        }
        return array[this.index(array)];
    }

    /** like choose, but each element can have different weights. bigger weight have higher chance. */
    public weightedChoose<T, A extends ArrayLike<T>>(array: A, getWeight: (x: T, i: number, a: A) => number): T {
        if (array.length <= 0) {
            throw new Error("Array is empty");
        }

        let sumOfWeights = 0;
        for (let i = 0; i < array.length; i++) {
            const x = array[i];
            sumOfWeights += getWeight(x, i, array);
        }

        const target = this.float(0, sumOfWeights);

        let cumulative = 0;
        for (let i = 0; i < array.length; i++) {
            const x = array[i];
            cumulative += getWeight(x, i, array);
            if (cumulative >= target) {
                return x;
            }
        }

        throw new Error("Unexpected choice");
    }

    /** pick k random elements from an array, allowing repetition */
    public pick<T>(array: ArrayLike<T>, k: int): T[] {
        if (array.length <= 0) {
            throw new Error("array is empty");
        }
        const out: T[] = [];
        for (let i = 0; i < k; i++) {
            out.push(this.choose(array));
        }
        return out;
    }

    /** pick k random elements from an array, without repetition */
    public sample<T>(array: ArrayLike<T>, k: int): T[] {
        if (array.length <= 0) {
            throw new Error("array is empty");
        }
        if (k > array.length) {
            throw new Error("k cannot be more than the array length");
        }
        return this.shuffleCopy(array).slice(0, k);
    }

    /** return a random number within the given range */
    public range(stop: int): int;
    public range(start: int, stop: int): int;
    public range(start: int, stop: int, step: int): int;
    public range(...args: RangeArgs): int {
        const [start, stop, step] = getRangeArgs(args);
        const width = stop - start;

        if (width <= 0) {
            throw new Error("empty range");
        }

        if (step === 1) {
            return Math.floor(start + this.int(width));
        }

        // non-unit step argument is supplied.
        let n: int;
        if (step > 0) {
            n = Math.floor((width + step - 1) / step);
        } else if (step < 0) {
            n = Math.floor((width + step + 1) / step);
        } else {
            throw new Error("zero step");
        }

        if (n <= 0) {
            throw new Error("empty range");
        }

        return start + step * this.int(n);
    }

    /** Unbiased in-place shuffle, the Fisher-Yates (Knuth) Shuffle */
    public shuffle<T>(a: T[]): void {
        let i: int = a.length;
        let j: int;
        let tmp: T;

        while (i >= 1) {
            j = this.int(i--);
            // swap
            tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
    }

    /** Calls shuffle on a copy of the input, and returns it. */
    public shuffleCopy<T>(it: Iterable<T> | ArrayLike<T>): T[] {
        const a = Array.from(it);
        this.shuffle(a);
        return a;
    }
}

export const random = new Random(SecureRandom.nextFloat);
