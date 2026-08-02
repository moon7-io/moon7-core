import { expect, test, describe } from "vitest";
import { getBit, setBit, setBitOn, setBitOff, toggleBit, BitField } from "~/index";

describe("Bits", () => {
    describe("Operations on single bits", () => {
        test("getBit should return the value of a specific bit", () => {
            const bits: BitField = 0b10101010;

            expect(getBit(bits, 0)).toBe(false);
            expect(getBit(bits, 1)).toBe(true);
            expect(getBit(bits, 2)).toBe(false);
            expect(getBit(bits, 3)).toBe(true);
            expect(getBit(bits, 4)).toBe(false);
            expect(getBit(bits, 5)).toBe(true);
            expect(getBit(bits, 6)).toBe(false);
            expect(getBit(bits, 7)).toBe(true);
        });

        test("setBit should set a bit to the specified boolean value", () => {
            const bits: BitField = 0b10101010;

            // Setting true where it's already false
            expect(setBit(bits, 0, true)).toBe(0b10101011);
            expect(setBit(bits, 2, true)).toBe(0b10101110);
            expect(setBit(bits, 4, true)).toBe(0b10111010);
            expect(setBit(bits, 6, true)).toBe(0b11101010);

            // Setting false where it's already true
            expect(setBit(bits, 1, false)).toBe(0b10101000);
            expect(setBit(bits, 3, false)).toBe(0b10100010);
            expect(setBit(bits, 5, false)).toBe(0b10001010);
            expect(setBit(bits, 7, false)).toBe(0b00101010);

            // No change tests
            expect(setBit(bits, 1, true)).toBe(bits);
            expect(setBit(bits, 0, false)).toBe(bits);
        });

        test("setBitOn should set a bit to 1", () => {
            const bits: BitField = 0b10101010;

            expect(setBitOn(bits, 0)).toBe(0b10101011);
            expect(setBitOn(bits, 2)).toBe(0b10101110);
            expect(setBitOn(bits, 4)).toBe(0b10111010);
            expect(setBitOn(bits, 6)).toBe(0b11101010);

            // No change when the bit is already set
            expect(setBitOn(bits, 1)).toBe(bits);
            expect(setBitOn(bits, 3)).toBe(bits);
            expect(setBitOn(bits, 5)).toBe(bits);
            expect(setBitOn(bits, 7)).toBe(bits);
        });

        test("setBitOff should set a bit to 0", () => {
            const bits: BitField = 0b10101010;

            expect(setBitOff(bits, 1)).toBe(0b10101000);
            expect(setBitOff(bits, 3)).toBe(0b10100010);
            expect(setBitOff(bits, 5)).toBe(0b10001010);
            expect(setBitOff(bits, 7)).toBe(0b00101010);

            // No change when the bit is already clear
            expect(setBitOff(bits, 0)).toBe(bits);
            expect(setBitOff(bits, 2)).toBe(bits);
            expect(setBitOff(bits, 4)).toBe(bits);
            expect(setBitOff(bits, 6)).toBe(bits);
        });

        test("toggleBit should flip a bit", () => {
            const bits: BitField = 0b10101010;

            // Toggle bits that are 1 -> 0
            expect(toggleBit(bits, 1)).toBe(0b10101000);
            expect(toggleBit(bits, 3)).toBe(0b10100010);
            expect(toggleBit(bits, 5)).toBe(0b10001010);
            expect(toggleBit(bits, 7)).toBe(0b00101010);

            // Toggle bits that are 0 -> 1
            expect(toggleBit(bits, 0)).toBe(0b10101011);
            expect(toggleBit(bits, 2)).toBe(0b10101110);
            expect(toggleBit(bits, 4)).toBe(0b10111010);
            expect(toggleBit(bits, 6)).toBe(0b11101010);
        });
    });

    describe("Edge cases for bit operations", () => {
        test("operations with large bit positions", () => {
            const bits: BitField = 0;

            // Testing with bit position 31 (largest bit in a 32-bit integer)
            expect(getBit(bits, 31)).toBe(false);
            expect(setBitOn(bits, 31)).toBe(0x80000000);
            expect(setBitOff(0x80000000, 31)).toBe(0);
            expect(toggleBit(bits, 31)).toBe(0x80000000);
        });
    });
});
