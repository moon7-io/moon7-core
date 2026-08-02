import type { RandomFn } from "./Random";
import type { float, int } from "./Types";

// 0x1_0000_0000
const TO_FLOAT = 4294967296;

export type Seed = string | int;
export type PseudoRandomFn = (seed: Seed) => PseudoRandom;

export interface PseudoRandom {
    get state(): int[];
    set state(value: int[]);
    nextInt(): int;
    nextFloat(): float;
}

/**
 * @example Using PseudoRandom directly
 * const prng = PseudoRandom.xmur3("hello");
 * prng(); // new random
 */
export namespace PseudoRandomCore {
    /**
     * MurmurHash3 mixing function
     * Used to generate initial states from string seed, for other PRNGs.
     */
    export function xmur3(str: string): PseudoRandom {
        let h = 1779033703 ^ str.length;
        for (let i = 0; i < str.length; i++) {
            h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
            h = (h << 13) | (h >>> 19);
        }
        const prng = () => {
            h = Math.imul(h ^ (h >>> 16), 2246822507);
            h = Math.imul(h ^ (h >>> 13), 3266489909);
            return (h ^= h >>> 16) >>> 0;
        };
        return {
            get state() {
                return [h];
            },
            set state(value) {
                [h] = value;
            },
            nextInt: prng,
            nextFloat: () => prng() / TO_FLOAT,
        };
    }

    /**
     * Good quality randomness, 128-bit state, fast.
     * xoshiro128 is slightly faster, but worse quality.
     *
     * @example Seeding with specific values
     * const prng = sfc32(1, 2, 3, 4);
     *
     * @example Seeding with xmur3
     * const prng = sfc32(...genSeed("apples", 4));
     */
    export function sfc32(a: int, b: int, c: int, d: int): PseudoRandom {
        const prng = () => {
            a >>>= 0;
            b >>>= 0;
            c >>>= 0;
            d >>>= 0;

            let t = (a + b) | 0;
            a = b ^ (b >>> 9);
            b = (c + (c << 3)) | 0;
            c = (c << 21) | (c >>> 11);
            d = (d + 1) | 0;
            t = (t + d) | 0;
            c = (c + t) | 0;
            return t >>> 0;
        };
        return {
            get state() {
                return [a, b, c, d];
            },
            set state(value) {
                [a, b, c, d] = value;
            },
            nextInt: prng,
            nextFloat: () => prng() / TO_FLOAT,
        };
    }

    /**
     * Simple but decent. 32-bit state, full period of 2^32.
     */
    export function mulberry32(a: int): PseudoRandom {
        const prng = () => {
            let t = (a += 0x6d2b79f5);
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return (t ^ (t >>> 14)) >>> 0;
        };
        return {
            get state() {
                return [a];
            },
            set state(value) {
                [a] = value;
            },
            nextInt: prng,
            nextFloat: () => prng() / TO_FLOAT,
        };
    }

    /**
     * xoshiro128 is slightly faster than sfc32, but worse quality.
     */
    export function xoshiro128(a: int, b: int, c: int, d: int): PseudoRandom {
        const prng = () => {
            const t = b << 9;
            let r = a * 5;
            r = ((r << 7) | (r >>> 25)) * 9;
            c ^= a;
            d ^= b;
            b ^= c;
            a ^= d;
            c ^= t;
            d = (d << 11) | (d >>> 21);
            return r >>> 0;
        };
        return {
            get state() {
                return [a, b, c, d];
            },
            set state(value) {
                [a, b, c, d] = value;
            },
            nextInt: prng,
            nextFloat: () => prng() / TO_FLOAT,
        };
    }
}

export namespace PseudoRandom {
    export const xmur3: PseudoRandomFn = seed => {
        return PseudoRandomCore.xmur3(`${seed}`);
    };

    export const sfc32: PseudoRandomFn = seed => {
        return PseudoRandomCore.sfc32(...genSeed(seed, 4));
    };

    export const mulberry32: PseudoRandomFn = seed => {
        return PseudoRandomCore.mulberry32(...genSeed(seed, 1));
    };

    export const xoshiro128: PseudoRandomFn = seed => {
        return PseudoRandomCore.xoshiro128(...genSeed(seed, 4));
    };
}

type Tuple<T, N extends number> = _TupleOf<T, N, []>;
type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N ? R : _TupleOf<T, N, [T, ...R]>;

export function genSeed<N extends number>(seed: Seed, length: N): Tuple<int, N> {
    return take(PseudoRandom.xmur3(seed).nextInt, length);
}

function take<N extends number>(next: RandomFn, length: int): Tuple<int, N> {
    const out: int[] = [];
    for (let i = 0; i < length; i++) {
        out.push(next());
    }
    return out as any;
}
