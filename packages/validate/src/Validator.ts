import { Predicate, isString } from "@moon7/inspect";

export type Validate = () => void;
export type RuleResult = true | string;
export type Rule<T> = (value: T) => RuleResult;
export type ObjectRule<T> = { [K in keyof T]: Rule<T[K]> };

export namespace Validator {
    export function validate<T>(value: T, rule: Rule<T>): RuleResult {
        return rule(value);
    }

    /** check() throws an Error if the validation fails */
    export function check<T>(value: T, rule: Rule<T>): void {
        const result = validate(value, rule);
        if (typeof result === "string") {
            throw new Error(result);
        }
    }

    export function isValid<T>(value: T, rule: Rule<T>): boolean {
        return validate(value, rule) === true;
    }
}

export namespace RuleResult {
    /** return the first error, or true if none */
    export function first(results: RuleResult[]): RuleResult {
        for (const result of results) {
            if (typeof result === "string") {
                return result;
            }
        }
        return true;
    }

    /** return all errors, or true if none */
    export function all(results: RuleResult[]): RuleResult {
        const errors: string[] = [];
        for (const result of results) {
            if (typeof result === "string") {
                errors.push(result);
            }
        }
        return errors.length === 0 ? true : errors.join("\n");
    }

    /** return true if there's at least one success. otherwise return all errors */
    export function any(results: RuleResult[]): RuleResult {
        const errors: string[] = [];
        for (const result of results) {
            if (typeof result === "string") {
                errors.push(result);
            }
        }
        return errors.length < results.length ? true : errors.join("\n");
    }

    export function negate(result: RuleResult): RuleResult {
        if (typeof result === "string") {
            return true;
        }
        return "Rule negation failed";
    }
}

// export namespace ObjectRules {
// export function required<T>(): Rule<T> {}
// }
