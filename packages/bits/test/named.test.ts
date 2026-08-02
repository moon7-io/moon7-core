import { expect, test, describe } from "vitest";
import { defineBitFlags, defineBitEnum, BitField } from "~/index";

describe("Named Bits", () => {
    describe("BitFlags", () => {
        test("defineBitFlags should create a collection with explicit bit positions", () => {
            // Create bit flags with explicit positions
            const Permissions = defineBitFlags({
                READ: 0,
                WRITE: 1,
                DELETE: 2,
                ADMIN: 5,
            });

            // Check bit positions are preserved
            expect(Permissions.READ).toBe(0);
            expect(Permissions.WRITE).toBe(1);
            expect(Permissions.DELETE).toBe(2);
            expect(Permissions.ADMIN).toBe(5);

            // Check mask function returns correct bitmasks
            expect(Permissions.mask("READ")).toBe(1 << 0); // 1
            expect(Permissions.mask("WRITE")).toBe(1 << 1); // 2
            expect(Permissions.mask("DELETE")).toBe(1 << 2); // 4
            expect(Permissions.mask("ADMIN")).toBe(1 << 5); // 32
        });

        test("defineBitFlags should handle non-sequential positions", () => {
            const SparseFlags = defineBitFlags({
                FLAG_A: 3,
                FLAG_B: 7,
                FLAG_C: 12,
                FLAG_D: 20,
            });

            expect(SparseFlags.FLAG_A).toBe(3);
            expect(SparseFlags.FLAG_B).toBe(7);
            expect(SparseFlags.FLAG_C).toBe(12);
            expect(SparseFlags.FLAG_D).toBe(20);

            expect(SparseFlags.mask("FLAG_A")).toBe(1 << 3); // 8
            expect(SparseFlags.mask("FLAG_B")).toBe(1 << 7); // 128
            expect(SparseFlags.mask("FLAG_C")).toBe(1 << 12); // 4096
            expect(SparseFlags.mask("FLAG_D")).toBe(1 << 20); // 1048576
        });

        test("defineBitFlags should work with large bit positions and handle unsigned correctly", () => {
            const LargeFlags = defineBitFlags({
                NORMAL: 5,
                LARGE: 30,
                MAX: 31,
            });

            expect(LargeFlags.NORMAL).toBe(5);
            expect(LargeFlags.LARGE).toBe(30);
            expect(LargeFlags.MAX).toBe(31);

            expect(LargeFlags.mask("NORMAL")).toBe(1 << 5); // 32
            expect(LargeFlags.mask("LARGE")).toBe(1 << 30); // 1073741824
            expect(LargeFlags.mask("MAX") >>> 0).toBe(0x80000000); // 2147483648 (unsigned)
        });
    });

    describe("BitEnum", () => {
        test("defineBitEnum should create a collection with sequential bit positions", () => {
            // Create bit enum with sequential positions
            const UserRoles = defineBitEnum("GUEST", "MEMBER", "MODERATOR", "ADMIN");

            // Check positions are assigned sequentially
            expect(UserRoles.GUEST).toBe(0);
            expect(UserRoles.MEMBER).toBe(1);
            expect(UserRoles.MODERATOR).toBe(2);
            expect(UserRoles.ADMIN).toBe(3);

            // Check mask function returns correct bitmasks
            expect(UserRoles.mask("GUEST")).toBe(1 << 0); // 1
            expect(UserRoles.mask("MEMBER")).toBe(1 << 1); // 2
            expect(UserRoles.mask("MODERATOR")).toBe(1 << 2); // 4
            expect(UserRoles.mask("ADMIN")).toBe(1 << 3); // 8
        });

        test("defineBitEnum should handle empty arguments", () => {
            // Should work with empty arguments
            const EmptyEnum = defineBitEnum();

            // Should have mask function but no properties
            expect(typeof EmptyEnum.mask).toBe("function");
            expect(Object.keys(EmptyEnum).length).toBe(1); // Only 'mask'
        });

        test("defineBitEnum should handle many items", () => {
            // Create enum with many items

            // Create an array of flag names to avoid TypeScript error with dynamic property access
            const flagNames = [
                "FLAG_0",
                "FLAG_1",
                "FLAG_2",
                "FLAG_3",
                "FLAG_4",
                "FLAG_5",
                "FLAG_6",
                "FLAG_7",
                "FLAG_8",
                "FLAG_9",
            ] as const;

            const ManyFlags = defineBitEnum(...flagNames);

            // Check all positions using the array of flag names
            for (let i = 0; i < 10; i++) {
                const flagName = flagNames[i];
                expect(ManyFlags[flagName]).toBe(i);
                expect(ManyFlags.mask(flagName)).toBe(1 << i);
            }
        });
    });

    describe("Practical usage", () => {
        test("Using BitFlags with bit operations", () => {
            const Permissions = defineBitFlags({
                READ: 0,
                WRITE: 1,
                DELETE: 2,
                ADMIN: 3,
            });

            // Create a user with READ and WRITE permissions
            let user: BitField = 0;
            user |= Permissions.mask("READ"); // Set READ bit
            user |= Permissions.mask("WRITE"); // Set WRITE bit

            // Check permissions
            expect((user & Permissions.mask("READ")) !== 0).toBe(true);
            expect((user & Permissions.mask("WRITE")) !== 0).toBe(true);
            expect((user & Permissions.mask("DELETE")) !== 0).toBe(false);
            expect((user & Permissions.mask("ADMIN")) !== 0).toBe(false);

            // Add ADMIN permission
            user |= Permissions.mask("ADMIN");
            expect((user & Permissions.mask("ADMIN")) !== 0).toBe(true);

            // Remove WRITE permission
            user &= ~Permissions.mask("WRITE");
            expect((user & Permissions.mask("WRITE")) !== 0).toBe(false);
        });

        test("Using BitEnum for flags with sequential positions", () => {
            const Features = defineBitEnum("DARK_MODE", "NOTIFICATIONS", "AUTO_SAVE", "SYNC");

            // Create settings with DARK_MODE and SYNC enabled
            let settings: BitField = 0;
            settings |= Features.mask("DARK_MODE");
            settings |= Features.mask("SYNC");

            // Verify settings
            expect((settings & Features.mask("DARK_MODE")) !== 0).toBe(true);
            expect((settings & Features.mask("NOTIFICATIONS")) !== 0).toBe(false);
            expect((settings & Features.mask("AUTO_SAVE")) !== 0).toBe(false);
            expect((settings & Features.mask("SYNC")) !== 0).toBe(true);

            // Toggle NOTIFICATIONS
            settings ^= Features.mask("NOTIFICATIONS");
            expect((settings & Features.mask("NOTIFICATIONS")) !== 0).toBe(true);

            // Toggle NOTIFICATIONS again
            settings ^= Features.mask("NOTIFICATIONS");
            expect((settings & Features.mask("NOTIFICATIONS")) !== 0).toBe(false);
        });
    });
});
