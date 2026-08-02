/**
 * Represents a field of bits as a numeric value
 * Used for efficient storage and manipulation of boolean flags
 */
export type BitField = number;

/**
 * Constant representing all bits set to 1
 * Equivalent to a bitfield with every bit enabled
 */
export const ALL: BitField = ~0 >>> 0;

/**
 * Constant representing all bits set to 0
 * Equivalent to a bitfield with every bit disabled
 */
export const NONE: BitField = 0;
