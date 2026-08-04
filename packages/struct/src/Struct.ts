import { isStruct, isArray, isObject, isFunction } from "@moon7/inspect";
import { ascending, by, natural, order } from "@moon7/sort";
import { Clone } from "./Clone";

/**
 * type helper to get type of nested object using string (dotted object path)
 * https://stackoverflow.com/questions/63719287/checking-deep-dot-notation-paths-in-typescript
 */
export type DottedTypeOf<Obj, Key extends string> = Obj extends object
    ? Key extends `${infer Parent}.${infer Leaf}`
        ? Parent extends keyof Obj
            ? DottedTypeOf<Obj[Parent], Leaf>
            : never
        : Key extends keyof Obj
          ? Obj[Key]
          : never
    : never;

const RX_BAD_KEYS = /^(__proto__)$/;
const NOT_FOUND = Symbol();
let enableKeyCheck = true;

/** check for prototype pollution. silently return non-existent key if bad */
function sanitizeKey<T>(key: T): T | symbol {
    if (enableKeyCheck && typeof key === "string" && RX_BAD_KEYS.test(key)) {
        return NOT_FOUND;
    }
    return key;
}

export namespace Struct {
    // const _clone = typeof globalThis.structuredClone === "function" ? structuredClone : deepClone;
    // const _clone = deepClone;

    /**
     * Disables key checking which allows overriding prototype.
     * Usage:
     * Struct.dangerouslyWithoutKeyChecking(() => {
     *     Struct.merge(obj, { __proto__: { isAdmin: () => true }});
     * });
     */
    export function dangerouslyWithoutKeyChecking(fn: () => void): void {
        try {
            enableKeyCheck = false;
            fn();
        } finally {
            enableKeyCheck = true;
        }
    }

    /**
     * Performs a deep clone using the clone function in this package.
     * Using structuredClone is better if you're not dealing with Vue's reactive.
     * This can clone Vue's reactive as plain objects (loses reactivity).
     *
     * Any extra overrides will be merged into the cloned object.
     */
    export function clone<T>(value: T): T;
    export function clone<T extends {}>(value: T, ...overrides: (Partial<T> | null | undefined)[]): T;
    export function clone<T extends {}>(value: T, ...overrides: (Partial<T> | null | undefined)[]): T {
        const cloned: T = Clone.cloneAny(value, { refs: new Map(), strict: false });
        if (overrides.length > 0) {
            if (typeof value !== "object" || value == null) {
                throw new Error("Cannot merge overrides into non-object value");
            }
            return merge(cloned, ...overrides);
        }
        return cloned;
    }

    /**
     * Fallback for ie11 and some older android browsers <= 4.4.4 and samsung internet <= v17.
     * Vue3 doesn't work with ie11 anyway, but samsung internet v17 is recent (2022).
     */
    // export function deepClone<T>(value: T): T {
    //     return Clone.cloneAny(value, { refs: new Map(), strict: false });
    // }

    /**
     * Use structured clone. Throws an error if not available.
     */
    // export function structuredClone<T>(value: T): T {
    //     return globalThis.structuredClone(value);
    // }

    /**
     * HACK: clone by serializing and deserializing JSON
     * No circular dependencies, and only JSON-serializable values are supported.
     */
    // export function jsonClone<T>(value: T): T {
    //     return JSON.parse(JSON.stringify(value));
    // }

    /**
     * `merge(...)` works like `Object.assign(...)` but it works recursively.
     * this mutates obj
     */
    export function merge<T extends {}>(obj: T, ...sources: (Partial<T> | null | undefined)[]): T {
        const dest: any = obj;
        for (const source of sources) {
            if (!source) continue;
            for (const [srcKey, srcValue] of Object.entries(source)) {
                const key = sanitizeKey(srcKey);
                const destValue = dest[key];
                // recursively merge if they're objects, otherwise assign.
                // merging arrays is complicated, and isn't handled.
                if (isStruct(destValue) && isStruct(srcValue)) {
                    merge(destValue, srcValue);
                } else {
                    dest[key] = srcValue;
                }
            }
        }
        return obj;
    }

    // export function mergeCopy<T extends {}>(obj: T, ...sources: (Partial<T> | null | undefined)[]): T {
    //     return merge(clone(obj), ...sources.map(s => clone(s)));
    // }

    /**
     * Create a Record<string, T> from a T[] using a function to derive a key.
     */
    export function record<T>(keyFn: (item: T) => string, items: T[]): Record<string, T> {
        const out: Record<string, T> = {};
        for (const item of items) {
            const key = sanitizeKey(keyFn(item));
            (out as any)[key] = item;
        }
        return out;
    }

    export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
        const out: any = {};
        for (const key of keys.map(sanitizeKey)) {
            out[key] = (obj as any)[key];
        }
        return out;
    }

    export function omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
        const out: any = { ...obj };
        for (const key of keys.map(sanitizeKey)) {
            delete out[key];
        }
        return out;
    }

    /**
     * Helper for get and set.
     * find(obj, "foo.bar.baz"); // [obj.foo.bar, "baz"]
     */
    export function find<T, K extends string>(obj: T, path: K, autoCreate = false): [any, string] {
        const keys = path.split(".").map(sanitizeKey);
        const last = keys.pop();
        for (const key of keys) {
            let value = (obj as any)[key];
            if (value === undefined) {
                if (autoCreate) {
                    value = (obj as any)[key] = {};
                } else {
                    return [value, key] as any;
                }
            }
            obj = value;
        }
        return [obj, last] as any;
    }

    /**
     * Retrieve the value specified by path.
     * This should never throw, and instead return undefined if there's no such path.
     */
    export function get<T, K extends string>(obj: T, path: K): DottedTypeOf<T, K> {
        const [o = {}, k] = find(obj, path);
        return o[k];
    }

    /**
     * Sets the value specified by path.
     * This may throw if the path does not exist.
     */
    export function set<T, K extends string, V extends DottedTypeOf<T, K>>(obj: T, path: K, value: V): V {
        const [o, k] = find(obj, path);
        return (o[k] = value);
    }

    /**
     * Sets the value specified by path.
     * Does not throw if the path does not exist, and creates empty objects.
     */
    export function put<T, K extends string, V extends DottedTypeOf<T, K>>(obj: T, path: K, value: V): V {
        const [o, k] = find(obj, path, true);
        return (o[k] = value);
    }

    /**
     * Deletes the value specified by path.
     * This should not throw.
     */
    export function remove<T, K extends string>(obj: T, path: K): void {
        const [o = {}, k] = find(obj, path);
        delete o[k];
    }

    /** patch is like calling set(obj, path, value) with various [path, value] */
    export function patch<T>(obj: T, record: Record<string, any>): void {
        const entries = Object.entries(record);
        // Patching is deterministic. We patch outer objects first, then we go deeper.
        // With sorting, we achieve this.
        entries.sort(
            order(
                // sort by the number of "."
                by(x => x[0].split(".").length),
                // then sort by the keys alphabetically
                by(x => x[0], natural())
            )
        );
        for (const [path, value] of entries) {
            set(obj, path, value);
        }
    }

    /**
     * Generate a diff between old and new object, such that you can use it with patch.
     * This is used to sync frontend/backend data by sending diffs instead of whole objects.
     *
     * const diffs = diff(oldObj, newObj);
     * patch(oldObj, diffs);
     * assert(isDeepEquals(oldObj, newObj));
     */
    export function diff<T>(_oldObj: T, _newObj: T): Record<string, any> {
        throw new Error("Not implemented");
    }

    /**
     * Checks for structural deep equality.
     * Instances of different objects can still be equal if they have the same shape and values.
     * Comparison is done using Object.is and not == or === operators.
     */
    export function isDeepEquals(a: any, b: any): boolean {
        // the same -- don't need to go further
        if (Object.is(a, b)) {
            return true;
        }

        // either or both is a function, but not referencing the same functions, so they're different
        if (isFunction(a) || isFunction(b)) {
            return false;
        }

        // different references. need to check their shape
        if (isObject(a) && isObject(b)) {
            // both arrays, so check for array equality
            if (isArray(a) && isArray(b)) {
                if (a.length !== b.length) {
                    return false;
                }

                for (let i = 0; i < a.length; i++) {
                    if (!isDeepEquals(a[i], b[i])) {
                        return false;
                    }
                }

                return true;
            }

            // one is an array but not the other means they're not the same
            if (isArray(a) || isArray(b)) {
                return false;
            }

            // both objects, so check for object equality.
            // get the keys and sort them to make them comparable.
            const ka = Object.keys(a).sort(ascending);
            const kb = Object.keys(b).sort(ascending);

            // if the keys are different, then the objects are different
            if (!isDeepEquals(ka, kb)) {
                return false;
            }

            // the keys are the same, so check the values
            for (const k of ka) {
                const va = (a as any)[k];
                const vb = (b as any)[k];

                // values are different
                if (!isDeepEquals(va, vb)) {
                    return false;
                }
            }

            // keys and values are the same, so objects have same shape and values
            return true;
        }

        // Object.is check failed and structural check failed, so they're different
        return false;
    }

    /**
     * This is like JSON.stringify, except that it sorts the object keys,
     * so that two stringified structs can be compared for equality.
     *
     * Since the purpose is normalization, and not formatting/prettifying,
     * there are no replacer or space parameters.
     */
    export function stringify(value: any): string {
        switch (typeof value) {
            case "string":
            case "number":
            case "boolean":
                return JSON.stringify(value);

            case "object": {
                if (value == null || Array.isArray(value)) {
                    return JSON.stringify(value);
                }

                const out = [];
                const entries = [];
                out.push("{");
                for (const key of Object.keys(value).sort()) {
                    const entry = [];
                    entry.push(JSON.stringify(key));
                    entry.push(stringify(value[key]));
                    entries.push(entry.join(":"));
                }
                out.push(entries.join(","));
                out.push("}");
                return out.join("");
            }

            default:
                throw new Error("Unsupported type");
        }
    }
}
