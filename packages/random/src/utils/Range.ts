export type RangeArgs = [number] | [number, number] | [number, number, number];

/**
 * Similar to python's range.
 * @example
 * for (let i of range(7)) console.log(i);              // 0, 1, 2, 3, 4, 5, 6
 * for (let i of range(2, 7)) console.log(i);           // 2, 3, 4, 5, 6
 * for (let i of range(2, 7, 2)) console.log(i);        // 2, 4, 6
 * console.log([...range(4)]);                          // [0, 1, 2, 3]
 */
export function range(stop: number): IterableIterator<number>;
export function range(start: number, stop: number): IterableIterator<number>;
export function range(start: number, stop: number, step: number): IterableIterator<number>;
export function* range(...args: RangeArgs): IterableIterator<number> {
    const [start, stop, step] = getRangeArgs(args);
    for (let i = start; i < stop; i += step) {
        yield i;
    }
}

/** helper to get the correct arguments of range, based on arity */
export function getRangeArgs(args: RangeArgs): [number, number, number] {
    switch (args.length) {
        case 1:
            return [0, args[0], 1];
        case 2:
            return [args[0], args[1], 1];
        case 3:
            return args;
        default:
            throw new Error("Invalid number of arguments");
    }
}
