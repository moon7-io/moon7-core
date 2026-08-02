import { BitField } from "~/type";

/**
 * Converts a bitfield to its binary string representation
 *
 * @param bits - The bitfield to convert
 * @param length - The length of the resulting string (default: 32)
 * @returns A string of 0s and 1s representing the bitfield
 *
 * @example
 * ```ts
 * toBinaryString(5) // Returns "00000000000000000000000000000101"
 * toBinaryString(5, 8) // Returns "00000101"
 * ```
 */
export function toBinaryString(bits: BitField, length = 32): string {
    return bits.toString(2).padStart(length, "0");
}

/**
 * Converts a bitfield to a formatted binary string with grouping
 * Groups bits in blocks of 4 and blocks of 8 for improved readability
 *
 * @param bits - The bitfield to convert
 * @param length - The length of the resulting string (default: 32)
 * @returns A formatted string with spaces between groups of 4 bits and dashes between groups of 8 bits
 *
 * @example
 * ```ts
 * toFormattedBinaryString(5) // Returns "0000 0000 - 0000 0000 - 0000 0000 - 0000 0101"
 * ```
 */
export function toFormattedBinaryString(bits: BitField, length = 32): string {
    const str = toBinaryString(bits, length);
    return (
        str
            .match(/.{1,8}/g)
            ?.map(x => x.match(/.{1,4}/g)?.join(" "))
            .join(" - ") ?? ""
    );
}

/**
 * Counts the number of bits set to 1 in a bitfield
 *
 * @param bits - The bitfield to analyze
 * @returns The number of bits set to 1
 *
 * @example
 * ```ts
 * countBits(0b10101) // Returns 3
 * ```
 */
export function countBits(bits: BitField): number {
    let count = 0;
    let value = bits;
    while (value) {
        count += value & 1;
        value >>>= 1;
    }
    return count;
}

/**
 * Checks if exactly one bit is set in the bitfield
 *
 * @param bits - The bitfield to check
 * @returns `true` if exactly one bit is set, otherwise `false`
 *
 * @example
 * ```ts
 * isSingleBit(8) // Returns true (only bit 3 is set)
 * isSingleBit(9) // Returns false (bits 0 and 3 are set)
 * ```
 */
export function isSingleBit(bits: BitField): boolean {
    return bits !== 0 && (bits & (bits - 1)) === 0;
}
