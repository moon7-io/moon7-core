import { Base256 } from "./Base256";

export namespace BaseAny {
    /**
     * Split a number into an array of digits of base-n.
     * Each digit is an integer.
     */
    export function split(num: bigint, base: number): number[] {
        const _base = BigInt(base);
        const out: number[] = [];
        let q: bigint = num >= 0 ? num : -num;
        let r: bigint;

        while (true) {
            r = q % _base;
            out.unshift(Number(r));
            q = (q - r) / _base;
            if (q == 0n) break;
        }

        return out;
    }

    /**
     * Join an array of digits back into a single integer.
     */
    export function join(digits: number[], base: number): bigint {
        const _base = BigInt(base);
        let out = 0n;
        for (const digit of digits) {
            out = out * _base + BigInt(digit);
        }
        return out;
    }

    /**
     * Encode a number as a string to base-n with custom digit representation.
     */
    export function write(num: bigint, base: number, chars: string): string {
        const _chars = [...chars]; // spreading allows unicode chars to work
        if (_chars.length < base) {
            throw new Error(`Insufficient number of characters (${_chars.length}) for base ${base}`);
        }
        return split(num, base)
            .map(c => _chars[c])
            .join("");
    }

    /**
     * Decode a base-n encoded string back into an integer.
     * The string input is case-sensitive.
     * For case-insensitive version, use decodeci.
     */
    export function read(str: string, base: number, chars: string): bigint {
        const _chars = [...chars]; // spreading allows unicode chars to work
        return join(
            [...str].map(c => _chars.indexOf(c)),
            base
        );
    }

    export function encode(bytes: Uint8Array, base: number, chars: string): string {
        return write(Base256.toBigInt(bytes), base, chars);
    }

    export function decode(baseX: string, base: number, chars: string): Uint8Array {
        return Base256.toBytes(read(baseX, base, chars));
    }
}
