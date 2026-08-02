import { expect, test, describe } from "vitest";
import {
    toBinaryString,
    toFormattedBinaryString,
    countBits,
    isSingleBit,
    BitField,
    ALL,
    NONE,
    applyMask,
    clearMask,
    setBitOn,
} from "~/index";

describe("Util", () => {
    describe("String representation", () => {
        test("toBinaryString should convert bits to binary string representation", () => {
            expect(toBinaryString(0b101, 8)).toBe("00000101");
            expect(toBinaryString(0b11011, 8)).toBe("00011011");
            expect(toBinaryString(0b101)).toBe("00000000000000000000000000000101");
        });

        test("toFormattedBinaryString should format bits with proper grouping", () => {
            expect(toFormattedBinaryString(0b101, 8)).toBe("0000 0101");
            expect(toFormattedBinaryString(0b10101010, 8)).toBe("1010 1010");
            expect(toFormattedBinaryString(0b1010101010101010, 16)).toBe("1010 1010 - 1010 1010");

            const thirtyTwoBits = 0b11110000101010101111000010101010;
            expect(toFormattedBinaryString(thirtyTwoBits)).toBe("1111 0000 - 1010 1010 - 1111 0000 - 1010 1010");
        });
    });

    describe("Bit analysis", () => {
        test("countBits should count the number of set bits", () => {
            expect(countBits(0)).toBe(0);
            expect(countBits(1)).toBe(1);
            expect(countBits(0b101)).toBe(2);
            expect(countBits(0b1111)).toBe(4);
            expect(countBits(0b10101010)).toBe(4);
            expect(countBits(0xffffffff)).toBe(32);
        });

        test("isSingleBit should check if exactly one bit is set", () => {
            expect(isSingleBit(0)).toBe(false);
            expect(isSingleBit(1)).toBe(true);
            expect(isSingleBit(2)).toBe(true);
            expect(isSingleBit(4)).toBe(true);
            expect(isSingleBit(8)).toBe(true);
            expect(isSingleBit(0b100000000)).toBe(true);
            expect(isSingleBit(3)).toBe(false);
            expect(isSingleBit(5)).toBe(false);
            expect(isSingleBit(7)).toBe(false);
            expect(isSingleBit(0xffffffff)).toBe(false);
        });
    });

    describe("Complex operations", () => {
        test("operations with bit combinations", () => {
            // Create alternating pattern 0101... for the first 16 bits
            let bits: BitField = 0;
            for (let i = 0; i < 16; i += 2) {
                bits = setBitOn(bits, i + 1);
            }
            // We're only setting bits 1,3,5,7,9,11,13,15 - which is 0b1010101010101010 = 43690
            expect(bits).toBe(0b1010101010101010);

            // To create a full 32-bit alternating pattern
            let fullPattern: BitField = 0;
            for (let i = 0; i < 32; i += 2) {
                fullPattern = setBitOn(fullPattern, i + 1);
            }
            // The correct expected value for a 32-bit alternating pattern with 1s in odd positions
            expect(fullPattern >>> 0).toBe(0xaaaaaaaa); // 2863311530 in decimal

            // We can also verify it matches the bit pattern we expect
            expect(toBinaryString(fullPattern)).toBe("10101010101010101010101010101010");

            // Clear all odd-indexed bits
            let mask: BitField = 0;
            for (let i = 0; i < 16; i += 1) {
                mask = setBitOn(mask, i * 2 + 1);
            }
            expect(clearMask(bits, mask)).toBe(0);

            // Set all bits
            expect(applyMask(bits, NONE)).toBe(bits);
            expect(applyMask(bits, ALL)).toBe(ALL);

            // Clear all bits
            expect(clearMask(bits, NONE)).toBe(bits);
            expect(clearMask(bits, ALL)).toBe(NONE);
        });
    });
});
