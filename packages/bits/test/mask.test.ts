import { expect, test, describe } from "vitest";
import { BitField, bitMask, checkMask, applyMask, clearMask, toggleMask } from "~/index";

describe("Mask", () => {
    test("bitMask should return the correct power of 2 value", () => {
        expect(bitMask(0)).toBe(0b00000001);
        expect(bitMask(1)).toBe(0b00000010);
        expect(bitMask(2)).toBe(0b00000100);
        expect(bitMask(3)).toBe(0b00001000);
        expect(bitMask(4)).toBe(0b00010000);
        expect(bitMask(5)).toBe(0b00100000);
        expect(bitMask(6)).toBe(0b01000000);
        expect(bitMask(7)).toBe(0b10000000);
    });

    describe("Operations on multiple bits", () => {
        test("checkMask should verify if specified bits are set", () => {
            const bits: BitField = 0b10101010;

            // Check with individual bit masks
            expect(checkMask(bits, 0b10000000)).toBe(true);
            expect(checkMask(bits, 0b01000000)).toBe(false);
            expect(checkMask(bits, 0b00100000)).toBe(true);
            expect(checkMask(bits, 0b00010000)).toBe(false);

            // Check with multiple bits in mask
            expect(checkMask(bits, 0b10100000)).toBe(true);
            expect(checkMask(bits, 0b01010000)).toBe(false);
            expect(checkMask(bits, 0b10000010)).toBe(true);
        });

        test("applyMask should set bits specified by mask", () => {
            const initial: BitField = 0b10101010;

            expect(applyMask(initial, 0b00010000)).toBe(0b10111010);
            expect(applyMask(initial, 0b01000000)).toBe(0b11101010);
            expect(applyMask(initial, 0b00000001)).toBe(0b10101011);
            expect(applyMask(initial, 0b01010101)).toBe(0b11111111);
        });

        test("clearMask should unset bits specified by mask", () => {
            const initial: BitField = 0b11111111;

            expect(clearMask(initial, 0b00000001)).toBe(0b11111110);
            expect(clearMask(initial, 0b00000100)).toBe(0b11111011);
            expect(clearMask(initial, 0b10000000)).toBe(0b01111111);
            expect(clearMask(initial, 0b10101010)).toBe(0b01010101);
        });

        test("toggleMask should toggle bits specified by mask", () => {
            const initial: BitField = 0b10101010;

            expect(toggleMask(initial, 0b00000001)).toBe(0b10101011);
            expect(toggleMask(initial, 0b00010000)).toBe(0b10111010);
            expect(toggleMask(initial, 0b10000000)).toBe(0b00101010);
            expect(toggleMask(initial, 0b11111111)).toBe(0b01010101);
        });
    });

    describe("Edge cases for mask operations", () => {
        test("bitMask with large bit position", () => {
            // Testing with bit position 31 (largest bit in a 32-bit integer)
            expect(bitMask(31) >>> 0).toBe(0x80000000);
        });
    });
});
