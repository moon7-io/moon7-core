import { Base16 } from "./Base16";

/**
 * Base256 is essentially byte array.
 * Provides convenient functions to convert between bigint and Uint8Array.
 * This is slow, so avoid using these except for small inputs.
 */
export namespace Base256 {
    export function toBigInt(bytes: Uint8Array): bigint {
        return BigInt(Base16.encode(bytes, true));
    }

    export function toBytes(value: bigint): Uint8Array {
        return Base16.decode(value.toString(16));
    }
}
