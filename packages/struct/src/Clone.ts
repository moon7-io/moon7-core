import { Inspector, isStruct, isArray, isSet, isMap } from "@moon7/inspect";

export interface CloneTypeMapping<T> {
    check: Inspector<T>;
    clone: (value: T, ctx: CloneContext) => T;
}

export interface CloneContext {
    refs: Map<any, any>;
    strict: boolean;
}

export namespace Clone {
    export const types: CloneTypeMapping<any>[] = [
        { check: isStruct, clone: cloneStruct },
        { check: isArray, clone: cloneArray },
        { check: isSet, clone: cloneSet },
        { check: isMap, clone: cloneMap },
    ];

    export function makeContext(strict = false): CloneContext {
        return { refs: new Map(), strict };
    }

    export function cloneArray<T>(value: T[], ctx = makeContext()): T[] {
        const cloned: T[] = [];
        ctx.refs.set(value, cloned);
        for (const x of value) {
            cloned.push(cloneAny(x, ctx));
        }
        return cloned;
    }

    export function cloneStruct<T extends Record<any, any>>(value: T, ctx = makeContext()): T {
        const cloned: Record<any, any> = {};
        ctx.refs.set(value, cloned);
        for (const [k, v] of Object.entries(value)) {
            cloned[k] = cloneAny(v, ctx);
        }
        return cloned;
    }

    export function cloneSet<T>(value: Set<T>, ctx = makeContext()): Set<T> {
        const cloned = new Set<T>();
        ctx.refs.set(value, cloned);
        for (const x of value) {
            cloned.add(cloneAny(x, ctx));
        }
        return cloned;
    }

    export function cloneMap<K, V>(value: Map<K, V>, ctx = makeContext()): Map<K, V> {
        const cloned = new Map<K, V>();
        ctx.refs.set(value, cloned);
        for (const [k, v] of value) {
            cloned.set(cloneAny(k, ctx), cloneAny(v, ctx));
        }
        return cloned;
    }

    export function cloneAny<T>(value: T, ctx = makeContext()): T {
        switch (typeof value) {
            case "boolean":
            case "function":
            case "number":
            case "string":
            case "bigint":
            case "undefined":
                return value;

            case "object":
                if (value == null) {
                    return value;
                } else if (ctx.refs.has(value)) {
                    return ctx.refs.get(value);
                } else {
                    for (const cloner of types) {
                        if (cloner.check(value)) {
                            return cloner.clone(value, ctx);
                        }
                    }
                }
        }

        if (ctx.strict) {
            console.error("Unsupported type for cloning", value);
            throw new Error("Unsupported type for cloning");
        }
        return value;
    }
}
