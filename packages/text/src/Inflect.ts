import { regexp } from "./RxTemplate";

// UpperCamelCase
// lowerCamelCase
// MixedCamelCase
// UPPER-KEBAB-CASE
// lower-kebab-case
// Mixed-Kebab-Case
// UPPER_SNAKE_CASE
// lower_snake_case
// Mixed-Snake-Case

// const rxCamel = /([A-Z]?[^A-Z]+(?=[A-Z]))|([A-Z]+(?=[A-Z][^A-Z]))|(.+)/g;

//                   Aaaa[A$_]                      $$$AAA[Aa_]                   x
// const rxVariable = /(([$_]*[A-Z]?)[^A-Z$_]+(?=[A-Z$_]))|(([$_]*[A-Z]+)(?=[A-Z$_][^A-Z$_]))|(.+)/g;

const rxCamel = regexp`?gc
    (
        [A-Z]?              // capital?
        [^A-Z]+             // any non-capital
        (?=[A-Z])           // bounded by capital
    )
    | (
        [A-Z]+              // multiple capital
        (?=[A-Z][^A-Z])     // bounded by capital then non-capital
    )
    | (.+)                  // anything else
`;

const rxVariable = regexp`?gc
    (
        [$_]*
        [A-Z]?              // capital?
        [^A-Z$_]+           // any non-capital
        (?=[A-Z$_])         // bounded by capital
    )
    | (
        [$_]*
        [A-Z]+              // multiple capital
        (?=[$_]*[A-Z][^A-Z$_]) // bounded by capital then non-capital
    )
    | (.+)                  // anything else
`;

// const rxVariable = /([A-Z\$]?[^A-Z\$_]+(?=[A-Z\$_]))|([A-Z\$]+(?=[A-Z\$_][^A-Z\$_]))|([^_]+)/g;

// const rxPlainCamel = /([A-Z]?[a-z0-9]+(?=[A-Z]))|([A-Z]+(?=[A-Z][a-z0-9]))|([A-Za-z0-9_$]+)/g;
// const rxCamelDollar = /(([_$]*[A-Z])?[a-z0-9_$]+(?=[A-Z]))|(([_$]*[A-Z])+(?=[A-Z][a-z0-9_$]))|([A-Za-z0-9_$]+)/g;

export type Splitter = (str: string) => string[];
export type Joiner = (arr: string[]) => string;

export function inflect(str: string, from: Splitter, to: Joiner): string {
    return to(from(str));
}

export namespace Inflect {
    export function upper(str: string): string {
        return str.toUpperCase();
    }

    export function lower(str: string): string {
        return str.toLowerCase();
    }

    export function lowerFirst(str: string): string {
        return str[0].toLowerCase() + str.slice(1);
    }

    export function upperFirst(str: string): string {
        return str[0].toUpperCase() + str.slice(1);
    }

    export function mixed(str: string): string {
        return str[0].toUpperCase() + str.slice(1).toLowerCase();
    }
}

export namespace Split {
    export const rx = (rx: RegExp) => (str: string) => Array.from(str.match(rx) ?? []);
    export const str = (sep: string) => (str: string) => str.split(sep);

    export const variable = rx(rxVariable);
    export const camel = rx(rxCamel);
    export const kebab = str("-");
    export const snake = str("_");
    export const spaces = str(" ");
}

export namespace Camel {
    export function upper(arr: string[]): string {
        return arr.map(Inflect.mixed).join("");
    }

    export function lower(arr: string[]): string {
        return Inflect.lowerFirst(arr.map(Inflect.mixed).join(""));
    }
}

export namespace Kebab {
    export function upper(arr: string[]): string {
        return arr.map(Inflect.upper).join("-");
    }

    export function lower(arr: string[]): string {
        return arr.map(Inflect.lower).join("-");
    }

    export function mixed(arr: string[]): string {
        return arr.map(Inflect.mixed).join("-");
    }
}

export namespace Snake {
    export function upper(arr: string[]): string {
        return arr.map(Inflect.upper).join("_");
    }

    export function lower(arr: string[]): string {
        return arr.map(Inflect.lower).join("_");
    }

    export function mixed(arr: string[]): string {
        return arr.map(Inflect.mixed).join("_");
    }
}

export namespace Spaces {
    export function upper(arr: string[]): string {
        return arr.map(Inflect.upper).join(" ");
    }

    export function lower(arr: string[]): string {
        return arr.map(Inflect.lower).join(" ");
    }

    export function mixed(arr: string[]): string {
        return arr.map(Inflect.mixed).join(" ");
    }
}
