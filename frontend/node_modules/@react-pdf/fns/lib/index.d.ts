/**
 * Applies a function to the value at the given index of an array
 *
 * @param index
 * @param fn
 * @param collection
 * @returns Copy of the array with the element at the given index replaced with the result of the function application.
 */
declare const adjust: (index: number, fn: (value: any) => any, collection: any[]) => any[];

type Fn$1 = (arg: any, ...args: any[]) => Promise<any> | any;
type FirstFnParameterType$1<T extends Fn$1[]> = T extends [
    ...any,
    (arg: infer A, ...args: any[]) => Promise<any> | any
] ? A : never;
type LastFnReturnType$1<T extends Fn$1[]> = T extends [
    (arg: any, ...args: any[]) => Promise<infer R> | infer R,
    ...any
] ? R : never;
/**
 * Performs right-to-left function composition with async functions support
 *
 * @param fns - Functions
 * @returns Composed function
 */
declare const asyncCompose: <T extends Fn$1[]>(...fns: T) => (value: FirstFnParameterType$1<T>, ...args: Parameters<T[0]> extends [any, ...infer Rest] ? Rest : []) => Promise<LastFnReturnType$1<T>>;

/**
 * Capitalize first letter of each word
 *
 * @param value - Any string
 * @returns Capitalized string
 */
declare const capitalize: (value?: string | null) => string | null | undefined;

/**
 * Casts value to array
 *
 * @template T - The type of the value.
 * @param value - The value to cast into an array.
 * @returns An array containing the given value.
 */
declare const castArray: <T = any>(value: T | T[]) => T[];

type Fn = (arg: any, ...args: any[]) => any;
type FirstFnParameterType<T extends Fn[]> = T extends [
    ...any,
    (arg: infer A, ...args: any[]) => any
] ? A : never;
type LastFnReturnType<T extends Fn[]> = T extends [
    (arg: any, ...args: any[]) => infer R,
    ...any
] ? R : never;
/**
 * Performs right-to-left function composition
 *
 * @param fns - Functions
 * @returns Composed function
 */
declare const compose: <T extends Fn[]>(...fns: T) => (value: FirstFnParameterType<T>, ...args: any[]) => LastFnReturnType<T>;

/**
 * Drops the last element from an array.
 *
 * @template T
 * @param  array - The array to drop the last element from
 * @returns - The new array with the last element dropped
 */
declare const dropLast: <T = any>(array: string | T[]) => string | T[];

/**
 * Applies a set of transformations to an object and returns a new object with the transformed values.
 *
 * @template T
 * @param transformations - The transformations to apply.
 * @param object - The object to transform.
 * @returns The transformed object.
 */
declare function evolve<T extends Record<string, any>>(transformations: Partial<{
    [K in keyof T]: (value: T[K]) => T[K];
}>, object: T): T;

/**
 * Retrieves the value at a given path from an object.
 *
 * @param target - The object to retrieve the value from.
 * @param path - The path of the value to retrieve.
 * @param defaultValue - The default value to return if the path does not exist.
 * @returns The value at the given path, or the default value if the path does not exist.
 */
declare const get: (target: any, path: (string | number)[], defaultValue: any) => any;

/**
 * Checks if a value is null or undefined.
 *
 * @template T - The type of the value.
 * @param value - The value to check
 * @returns True if the value is null or undefined, false otherwise
 */
declare const isNil: (value: unknown) => value is null | undefined;

/**
 * Returns the last character of a string.
 *
 * @param value - The input value
 * @returns The last character of the string
 */
declare function last(value: string): string;
declare function last<T>(value: T[]): T;

type IteratorFn = (value: any, key: string, index: number) => any;
/**
 * Maps over the values of an object and applies a function to each value.
 *
 * @param object - The object to map over
 * @param fn - The function to apply to each value
 * @returns A new object with the mapped values
 */
declare const mapValues: (object: Record<string, any>, fn: IteratorFn) => object;

interface PercentMatch {
    percent: number;
    value: number;
}
/**
 * Get percentage value of input
 *
 * @param value
 * @returns Percent value (if matches)
 */
declare const matchPercent: (value: string | number | null) => PercentMatch | null;

/**
 * Creates a new object by omitting specified keys from the original object.
 *
 * @param keys - The key or keys to omit
 * @param object - The original object
 * @returns The new object without the omitted keys
 */
declare const omit: (keys: string | string[], object: Record<string, any>) => object;

/**
 * Picks the specified keys from an object and returns a new object with only those keys.
 *
 * @param keys - The keys to pick from the object
 * @param object - The object to pick the keys from
 * @returns A new object with only the picked keys
 */
declare const pick: (keys: (string | number)[], obj: Record<string, any>) => object;

/**
 * Repeats an element a specified number of times.
 *
 * @template T
 * @param element - Element to be repeated
 * @param length - Number of times to repeat element
 * @returns Repeated elements
 */
declare const repeat: <T = any>(element: T, length?: number) => T[];

/**
 * Reverses the list
 *
 * @template T
 * @param list - List to be reversed
 * @returns Reversed list
 */
declare const reverse: <T = any>(list: T[]) => T[];

/**
 * Capitalize first letter of string
 *
 * @param value - String
 * @returns Capitalized string
 */
declare const upperFirst: (value?: string | null) => string | null | undefined;

/**
 * Returns a new array with all the values from the original array that are not present in the keys array.
 *
 * @param keys - The keys to pick from the object
 * @param array - Array to filter the values from
 * @returns A new array with without the omitted values
 */
declare const without: <T = any>(keys: T[], array: T[]) => T[];

/**
 * Parse a string or number to a float
 *
 * @param value - String or number
 * @returns Parsed float
 */
declare const parseFloat: (value: string | number) => number;

export { adjust, asyncCompose, capitalize, castArray, compose, dropLast, evolve, get, isNil, last, mapValues, matchPercent, omit, parseFloat, pick, repeat, reverse, upperFirst, without };
