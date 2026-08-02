/**
 * Functions and types for creating named bit collections
 * Provides a type-safe way to define constants for bit positions and retrieve their bitmasks
 * @module named
 */

import { bitMask } from "~/mask";
import { BitField } from "~/type";

/**
 * Type for a named bit collection with a mask lookup function
 *
 * @template T - A record mapping string keys to bit position numbers
 * @extends T - Includes all the original named bit positions
 * @property mask - Function to get a bitmask for a named bit position
 */
export type BitFlags<T extends Record<string, number>> = T & { mask: (name: keyof T) => BitField };

/**
 * Creates a named bit collection from an object with explicit bit positions
 *
 * @template T - A record mapping string keys to bit position numbers
 * @param definition - An object mapping names to bit positions
 * @returns A named bit collection with the original mappings plus a mask function
 *
 * @example
 * ```ts
 * const UserFlags = defineBitFlags({
 *   ADMIN: 0,       // bit 0
 *   MODERATOR: 1,   // bit 1
 *   VERIFIED: 2,    // bit 2
 *   PREMIUM: 3      // bit 3
 * });
 *
 * // Get bit position
 * const adminPosition = UserFlags.ADMIN;  // 0
 *
 * // Get bitmask
 * const adminMask = UserFlags.mask("ADMIN");  // 1 (binary: 0001)
 * ```
 */
export function defineBitFlags<T extends Record<string, number>>(definition: T): BitFlags<T> {
    const result = { ...definition } as BitFlags<T>;
    result.mask = (name: keyof T) => bitMask(result[name]);
    return result;
}

/**
 * Type for a named bit collection created from a sequence of string names
 *
 * @template T - String literal type with the names of bit positions
 * @property [K in T] - Each name is mapped to its sequential bit position
 * @property mask - Function to get a bitmask for a named bit position
 */
export type BitEnum<T extends string> = { [K in T]: number } & { mask: (name: T) => BitField };

/**
 * Creates a named bit collection from a sequence of string names
 * Each name is automatically assigned a sequential bit position starting from 0
 *
 * @template T - String literal type with the names of bit positions
 * @param names - String names for each bit position
 * @returns A named bit collection with sequential bit positions and a mask function
 *
 * @example
 * ```ts
 * const UserRoles = defineBitEnum(
 *   "GUEST",     // bit 0
 *   "MEMBER",    // bit 1
 *   "MODERATOR", // bit 2
 *   "ADMIN"      // bit 3
 * );
 *
 * // Get bit position
 * const adminPosition = UserRoles.ADMIN;  // 3
 *
 * // Get bitmask
 * const adminMask = UserRoles.mask("ADMIN");  // 8 (binary: 1000)
 * ```
 */
export function defineBitEnum<T extends string>(...names: readonly T[]): BitEnum<T> {
    const result = {} as Record<string, number> & { mask: (name: T) => BitField };
    names.forEach((name, index) => (result[name] = index));
    result.mask = (name: T) => bitMask(result[name]);
    return result as BitEnum<T>;
}
