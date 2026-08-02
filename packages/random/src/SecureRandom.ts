import { float, int } from "./Types";

const bytes = new Uint32Array(2);

export namespace SecureRandom {
    export function nextFloat(): float {
        crypto.getRandomValues(bytes);
        // keep all 32 bits of the the first, top 20 of the second for 52 random bits
        const mantissa = bytes[0] * Math.pow(2, 20) + (bytes[1] >>> 12);
        // shift all 52 bits to the right of the decimal point
        return mantissa * Math.pow(2, -52);
    }

    export function nextInt(): int {
        crypto.getRandomValues(bytes);
        return bytes[0];
    }
}

// export function nextFloat(): float {
//     const buf = new Uint32Array(2);
//     crypto.getRandomValues(buf);
//     // keep all 32 bits of the the first, top 20 of the second for 52 random bits
//     const mantissa = buf[0] * Math.pow(2, 20) + (buf[1] >>> 12);
//     // shift all 52 bits to the right of the decimal point
//     return mantissa * Math.pow(2, -52);
// }

// function get<T extends Uint32Array | Uint8Array>(buf: T): int {
//     crypto.getRandomValues(buf);
//     return buf[0];
// }
