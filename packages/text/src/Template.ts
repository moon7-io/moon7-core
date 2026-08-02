export const rxBrace = /(?<esc>\\)?(?<grp>{(?<key1>.*?)})/gi;
export const rxDollar = /(?<esc>\\)?(?<grp>\$(?<key1>[a-z_][a-z0-9_]*)|\${(?<key2>.*?)})/gi;

export function template(pattern: RegExp, text: string, dict: Record<string, string>): string {
    return text.replace(pattern, (...args) => {
        const { esc, grp, key1, key2 } = args.pop();
        const key = key1 ?? key2;
        if (esc != null) {
            return grp; // {key}
        }
        if (key in dict) {
            return dict[key];
        }
        throw new Error(`Not found ${key}`);
    });
}

export const braceTemplate = template.bind(undefined, rxBrace);
export const dollarTemplate = template.bind(undefined, rxDollar);
