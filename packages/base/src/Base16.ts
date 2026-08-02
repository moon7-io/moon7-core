const enc = new TextEncoder();
const dec = new TextDecoder("utf-8");

export namespace Base16 {
    export function encode(bytes: Uint8Array, prefixZeroX = false): string {
        const hex: string[] = [];
        for (const b of bytes) {
            hex.push((b >= 0x10 ? "" : "0") + b.toString(16));
        }
        return (prefixZeroX ? "0x" : "") + hex.join("");
    }

    export function decode(hex: string): Uint8Array {
        // ignore sign
        if (hex.startsWith("-")) {
            hex = hex.slice(1);
        }
        // ignore prefix
        if (hex.startsWith("0x")) {
            hex = hex.slice(2);
        }
        // pad 0
        if (hex.length % 2 !== 0) {
            hex = "0" + hex;
        }
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0, j = 0; i < bytes.length; i++, j += 2) {
            bytes[i] = parseInt(hex.slice(j, j + 2), 16);
        }
        return bytes;
    }

    export function encodeText(text: string): string {
        return encode(enc.encode(text));
    }

    export function decodeText(base64: string): string {
        return dec.decode(decode(base64));
    }
}
