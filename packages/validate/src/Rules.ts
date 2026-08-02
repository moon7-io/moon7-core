import { Predicate } from "@moon7/inspect";
import { context } from "~/Context";
import { ObjectRule, Rule, RuleResult } from "~/Validator";

export namespace Rules {
    /** Overrides rule message */
    export function except<T>(rule: Rule<T>, message: string): Rule<T> {
        return value => {
            const result = rule(value);
            return result === true ? true : message;
        };
    }

    export function inspect<T>(cond: Predicate<T>, message: string): Rule<T> {
        return value => cond(value) || message;
    }

    export function subject<T>(name: string, rule: Rule<T>): Rule<T> {
        return value => {
            try {
                context.pushSubject(name);
                const result = rule(value);
                return result;
            } finally {
                context.popSubject();
            }
        };
    }

    export function map<T, U>(fn: (value: T) => U, rule: Rule<U>): Rule<T> {
        return value => rule(fn(value));
    }

    export function object<T>(obj: ObjectRule<T>): Rule<T> {
        return value => {
            const results: RuleResult[] = [];
            for (const [key, rule] of Object.entries(obj) as [keyof T, Rule<any>][]) {
                context.pushObjectField(key, value);
                const result = rule({ subject, value: value[key] });
                context.popObjectField();
                results.push(result);
            }
            return RuleResult.all(results);
        };
    }

    // export const optional: Rule<any> = value => 0 as any;
    export function optional<T>(rule: Rule<T>): Rule<T> {
        throw "not implemented";
    }

    export const required: Rule<any> = value => {
        const [key, target] = context.objectField;
        return key in target || `key ${key} is required.`;
    };

    export function first<T>(...rules: Rule<T>[]): Rule<T> {
        return value => RuleResult.first(rules.map(rule => rule(value)));
    }

    export function and<T>(...rules: Rule<T>[]): Rule<T> {
        return value => RuleResult.all(rules.map(rule => rule(value)));
    }

    export function or<T>(...rules: Rule<T>[]): Rule<T> {
        return value => RuleResult.any(rules.map(rule => rule(value)));
    }

    export function not<T>(rule: Rule<T>): Rule<T> {
        return value => RuleResult.negate(rule(value));
    }

    export function lazy<T>(fn: () => Rule<T>): Rule<T> {
        return value => fn()(value);
    }
}

export const Patterns = {
    HasLowerCase: /[a-z]/,
    HasUpperCase: /[A-Z]/,
    HasDigits: /[0-9]/,
    LowerCaseOnly: /^[a-z]*$/,
    UpperCaseOnly: /^[A-Z]*$/,
    DigitsOnly: /^[0-9]*$/,
};

export namespace StringRules {
    export const containsLowerCaseLetter: Rule<string> = value =>
        Patterns.HasLowerCase.test(value) || `${context.subject} must contain lowercase letter.`;

    export const containsUpperCaseLetter: Rule<string> = value =>
        Patterns.HasUpperCase.test(value) || `${context.subject} must contain uppercase letter.`;

    export const containsDigit: Rule<string> = value =>
        Patterns.HasDigits.test(value) || `${context.subject} must contain digits.`;

    export const numeric: Rule<string> = value =>
        Patterns.DigitsOnly.test(value) || `${context.subject} must contain digits only.`;

    export function minLength(lo: number): Rule<string> {
        return value => value.length >= lo || `${context.subject} must have at least ${lo} characters.`;
    }

    export function maxLength(hi: number): Rule<string> {
        return value => value.length <= hi || `${context.subject} must have at most ${hi} characters.`;
    }

    export function equals(other: string, otherSubject = ""): Rule<string> {
        return value => value === other || `${context.subject} must match ${otherSubject}`;
    }
}

export namespace NumberRules {
    export function min(lo: number): Rule<number> {
        return value => value >= lo || `${context.subject} must be at least ${lo}.`;
    }

    export function max(hi: number): Rule<number> {
        return value => value <= hi || `${context.subject} must be at most ${hi}.`;
    }

    export function between(lo: number, hi: number): Rule<number> {
        return value => (value >= lo && value <= hi) || `${context.subject} must be between ${lo} and ${hi}.`;
    }
}
