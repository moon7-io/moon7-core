import { BitField } from "~/type";

/**
 * Gets the power of 2 value (bitmask) based on the bit's position
 *
 * @param i - Zero-based index of the bit position
 * @returns A number with only the bit at position i set to 1
 *
 * @example
 * ```ts
 * bitMask(0) // Returns 1 (binary: 0001)
 * bitMask(1) // Returns 2 (binary: 0010)
 * bitMask(2) // Returns 4 (binary: 0100)
 * ```
 */
export function bitMask(i: number) {
    return (1 << i) >>> 0;
}

/**
 * Checks if any of the bits specified by the mask are set in the bitfield
 *
 * @param bits - The bitfield to check
 * @param mask - The bitmask specifying which bits to check
 * @returns `true` if any bit from the mask is set in the bitfield, otherwise `false`
 *
 * @example
 * ```ts
 * checkMask(5, 4) // Returns true (5 = 0101, 4 = 0100, bits overlap)
 * checkMask(5, 8) // Returns false (5 = 0101, 8 = 1000, no overlap)
 * ```
 */
export function checkMask(bits: BitField, mask: number): boolean {
    return (bits & mask) !== 0;
}

/**
 * Sets (turns on) multiple bits specified by the mask in the bitfield
 *
 * @param bits - The original bitfield
 * @param mask - The bitmask specifying which bits to set
 * @returns A new bitfield with the specified bits set
 *
 * @example
 * ```ts
 * applyMask(5, 8) // Returns 13 (5 = 0101, 8 = 1000, result = 1101)
 * ```
 */
export function applyMask(bits: BitField, mask: number): BitField {
    return (bits | mask) >>> 0;
}

/**
 * Clears (turns off) multiple bits specified by the mask in the bitfield
 *
 * @param bits - The original bitfield
 * @param mask - The bitmask specifying which bits to clear
 * @returns A new bitfield with the specified bits cleared
 *
 * @example
 * ```ts
 * clearMask(5, 4) // Returns 1 (5 = 0101, 4 = 0100, result = 0001)
 * ```
 */
export function clearMask(bits: BitField, mask: number): BitField {
    return bits & ~mask;
}

/**
 * Toggles multiple bits specified by the mask in the bitfield
 *
 * @param bits - The original bitfield
 * @param mask - The bitmask specifying which bits to toggle
 * @returns A new bitfield with the specified bits toggled
 *
 * @example
 * ```ts
 * toggleMask(5, 6) // Returns 3 (5 = 0101, 6 = 0110, result = 0011)
 * ```
 */
export function toggleMask(bits: BitField, mask: number): BitField {
    return (bits ^ mask) >>> 0;
}
