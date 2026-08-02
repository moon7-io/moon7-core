/**
 * LruCache is a Map that has limited capacity. When the capacity is reached,
 * it will delete the least-recently-used item.
 *
 * Using get and set will refresh the entry's position.
 *
 * Other methods, including iterators (entries, keys, values, Symbol.iterator)
 * does not refresh the entry's position.
 *
 * Implementation notes:
 * JS Map maintains insertion order, so to refresh an entry, we simply need
 * to delete and add it back in.
 */
export class LruCache<K, V> implements Map<K, V> {
    private readonly cache: Map<K, V>;
    public capacity: number;

    public constructor(capacity: number) {
        this.cache = new Map();
        this.capacity = capacity;
    }

    public clear(): void {
        this.cache.clear();
    }

    public prune(capacityOffset = 0): void {
        const max = this.capacity + capacityOffset;
        while (this.cache.size > max) {
            const first = this.cache.keys().next().value;
            if (first) {
                this.cache.delete(first);
            }
        }
    }

    public delete(key: K): boolean {
        return this.cache.delete(key);
    }

    public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any): void {
        return this.cache.forEach(callbackfn, thisArg);
    }

    /** get an item without refreshing it */
    public peek(key: K): V | undefined {
        return this.cache.get(key);
    }

    /** gets an item with refreshing */
    public get(key: K): V | undefined {
        if (!this.cache.has(key)) {
            return;
        }
        const item = this.cache.get(key)!;
        this.cache.delete(key);
        this.cache.set(key, item);
        return item;
    }

    /** checks without refreshing */
    public has(key: K): boolean {
        return this.cache.has(key);
    }

    /** sets an item with refreshing */
    public set(key: K, value: V): this {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }
        this.prune(-1);
        this.cache.set(key, value);
        return this;
    }

    public get size(): number {
        return this.cache.size;
    }

    public [Symbol.iterator](): MapIterator<[K, V]> {
        return this.cache[Symbol.iterator]();
    }

    public get [Symbol.toStringTag](): string {
        return this.cache[Symbol.toStringTag];
    }

    public entries(): MapIterator<[K, V]> {
        return this.cache.entries();
    }

    public keys(): MapIterator<K> {
        return this.cache.keys();
    }

    public values(): MapIterator<V> {
        return this.cache.values();
    }
}
