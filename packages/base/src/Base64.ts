import { BASE64 } from "./Chars";

const BASE64_LOOKUPS = new Map<string, Uint8Array>();
const enc = new TextEncoder();
const dec = new TextDecoder("utf-8");

export namespace Base64 {
    export function encode(bytes: Uint8Array, chars = BASE64, pad = false): string {
        const out: string[] = [];
        const remainder = bytes.byteLength % 3;
        const n = bytes.byteLength - remainder;

        for (let i = 0; i < n; i += 3) {
            out.push(chars[bytes[i] >> 2]);
            out.push(chars[((bytes[i] & 0b000011) << 4) | (bytes[i + 1] >> 4)]);
            out.push(chars[((bytes[i + 1] & 0b001111) << 2) | (bytes[i + 2] >> 6)]);
            out.push(chars[bytes[i + 2] & 0b111111]);
        }

        if (remainder === 1) {
            out.push(chars[(bytes[n] & 0b11111100) >> 2]);
            out.push(chars[(bytes[n] & 0b00000011) << 4]);
            if (pad) {
                out.push("==");
            }
        } else if (remainder === 2) {
            out.push(chars[(bytes[n] & 0b11111100) >> 2]);
            out.push(chars[((bytes[n] & 0b00000011) << 4) | (bytes[n + 1] >> 4)]);
            out.push(chars[(bytes[n + 1] & 0b00001111) << 2]);
            if (pad) {
                out.push("=");
            }
        }
        return out.join("");
    }

    export function decode(base64: string, chars = BASE64): Uint8Array {
        base64 = sanitize(base64, chars);
        const size = Math.floor(base64.length * 0.75);
        const lookup = getLookup(chars);
        const bytes = new Uint8Array(size);
        const len = base64.length;

        for (let i = 0, p = 0; i < len; i += 4) {
            const a = lookup[base64.charCodeAt(i)];
            const b = lookup[base64.charCodeAt(i + 1)];
            const c = lookup[base64.charCodeAt(i + 2)];
            const d = lookup[base64.charCodeAt(i + 3)];
            bytes[p++] = (a << 2) | (b >> 4);
            bytes[p++] = ((b & 15) << 4) | (c >> 2);
            bytes[p++] = ((c & 3) << 6) | (d & 63);
        }

        return bytes;
    }

    export function encodeText(text: string, chars = BASE64, pad = false): string {
        return encode(enc.encode(text), chars, pad);
    }

    export function decodeText(base64: string, chars = BASE64): string {
        return dec.decode(decode(base64, chars));
    }
}

function getLookup(chars: string): Uint8Array {
    let lookup = BASE64_LOOKUPS.get(chars);
    if (!lookup) {
        if (chars.length !== 64) {
            throw new Error("Chars must be 64 characters");
        }
        lookup = new Uint8Array(256);
        for (let i = 0; i < chars.length; i++) {
            const byte = chars.charCodeAt(i);
            if ((byte & 0xff) !== byte) {
                throw new Error("Expected byte");
            }
            lookup[byte] = i;
        }
        BASE64_LOOKUPS.set(chars, lookup);
    }
    return lookup;
}

function escape(rx: string) {
    return rx.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
}

function sanitize(input: string, chars: string): string {
    const rx = new RegExp(`[^${escape(chars)}]`, "g");
    return input.replace(rx, "");
}
