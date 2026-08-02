import { applyMask, bitMask, checkMask, clearMask, toggleMask } from "~/mask";
import { BitField } from "~/type";

/**
 * Gets the value of a single bit at the specified index
 *
 * @param bits - The bitfield to check
 * @param index - Zero-based index of the bit to check
 * @returns `true` if the bit is set, otherwise `false`
 *
 * @example
 * ```ts
 * getBit(5, 0) // Returns true (5 = 0101, bit 0 is 1)
 * getBit(5, 1) // Returns false (5 = 0101, bit 1 is 0)
 * ```
 */
export function getBit(bits: BitField, index: number): boolean {
    return checkMask(bits, bitMask(index));
}

/**
 * Sets a single bit at the specified index to the given boolean value
 *
 * @param bits - The original bitfield
 * @param index - Zero-based index of the bit to set
 * @param value - The boolean value to set (true = 1, false = 0)
 * @returns A new bitfield with the bit at the specified index set to the given value
 *
 * @example
 * ```ts
 * setBit(5, 1, true) // Returns 7 (5 = 0101, setting bit 1 to 1 gives 0111)
 * setBit(5, 0, false) // Returns 4 (5 = 0101, setting bit 0 to 0 gives 0100)
 * ```
 */
export function setBit(bits: BitField, index: number, value: boolean): BitField {
    return value ? setBitOn(bits, index) : setBitOff(bits, index);
}

/**
 * Sets (turns on) a single bit at the specified index
 *
 * @param bits - The original bitfield
 * @param index - Zero-based index of the bit to enable
 * @returns A new bitfield with the bit at the specified index set to 1
 *
 * @example
 * ```ts
 * setBitOn(5, 1) // Returns 7 (5 = 0101, setting bit 1 to 1 gives 0111)
 * ```
 */
export function setBitOn(bits: BitField, index: number): BitField {
    return applyMask(bits, bitMask(index));
}

/**
 * Clears (turns off) a single bit at the specified index
 *
 * @param bits - The original bitfield
 * @param index - Zero-based index of the bit to disable
 * @returns A new bitfield with the bit at the specified index set to 0
 *
 * @example
 * ```ts
 * setBitOff(5, 0) // Returns 4 (5 = 0101, setting bit 0 to 0 gives 0100)
 * ```
 */
export function setBitOff(bits: BitField, index: number): BitField {
    return clearMask(bits, bitMask(index));
}

/**
 * Toggles a single bit at the specified index
 *
 * @param bits - The original bitfield
 * @param index - Zero-based index of the bit to toggle
 * @returns A new bitfield with the bit at the specified index toggled
 *
 * @example
 * ```ts
 * toggleBit(5, 0) // Returns 4 (5 = 0101, toggling bit 0 gives 0100)
 * toggleBit(5, 1) // Returns 7 (5 = 0101, toggling bit 1 gives 0111)
 * ```
 */
export function toggleBit(bits: BitField, index: number): BitField {
    return toggleMask(bits, bitMask(index));
}
