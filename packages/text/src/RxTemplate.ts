const rxFlags = /^\?([A-Za-z]+)/;
const rxWhitespace = /(\s+)/g;
const rxWhitespaceAndComments = /(\s+)|((?<!\\)\/\/.*$)|(\\\/+)/gm;

function removeWhitespaceAndComments(text: string): string {
    // (\s+)                // match one or more whitespace
    // ((?<!\\)\/\/.*$)     // match from // to $ and before // is not \
    // (\\\/+)              // match \ followed by one or more / (preserve these)
    return text.replace(rxWhitespaceAndComments, (m, a) => {
        // remove whitespace and comments but preserve escape sequences
        return m.startsWith("\\") ? m.slice(1) : "";
    });
}

function removeWhitespace(text: string): string {
    return text.replace(rxWhitespace, "");
}

function parseFlags(strings: string[]): string | undefined {
    if (strings[0].startsWith("?")) {
        const match = strings[0].match(rxFlags);
        if (match) {
            const [all, flags] = match;
            strings[0] = strings[0].slice(all.length);
            return flags;
        }
    }
    return undefined;
}

/**
 * To add flags, prefix the input with `?flags`.
 * @example Adding flags `g` and `m`:
 * regexp`?gm [a-z]+`;
 *
 * To allow line comments, add the flag `c`.
 * Line comments begin with //.
 * You can escape it with \.
 *
 * @example Enabling line comments:
 * regexp`?c
 *     [a-c]    // line comment 1
 *     | [d-f]  // line comment 2
 *     | [g-i]  \// escaped
 * `;
 */
export function regexp(strings: string): RegExp;
export function regexp(strings: TemplateStringsArray, ...values: any[]): RegExp;
export function regexp(strings: string | TemplateStringsArray, ...values: any[]): RegExp {
    const raw = typeof strings === "string" ? [strings] : [...strings.raw];
    const flags = new Set<string>(parseFlags(raw));
    const mapFn = flags.has("c") ? removeWhitespaceAndComments : removeWhitespace;

    const source = raw
        .reduce((acc, curr, i) => {
            acc.push(curr);
            const value = values[i];
            if (value) {
                acc.push(`${value}`);
            }
            return acc;
        }, [] as string[])
        .map(mapFn);

    flags.delete("c");
    return new RegExp(source.join(""), [...flags].join(""));
}
