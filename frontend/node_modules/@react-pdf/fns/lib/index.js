/**
 * Applies a function to the value at the given index of an array
 *
 * @param index
 * @param fn
 * @param collection
 * @returns Copy of the array with the element at the given index replaced with the result of the function application.
 */
const adjust = (index, fn, collection) => {
    if (index >= 0 && index >= collection.length)
        return collection;
    if (index < 0 && Math.abs(index) > collection.length)
        return collection;
    const i = index < 0 ? collection.length + index : index;
    return Object.assign([], collection, { [i]: fn(collection[i]) });
};

/* eslint-disable no-await-in-loop */
/**
 * Performs right-to-left function composition with async functions support
 *
 * @param fns - Functions
 * @returns Composed function
 */
const asyncCompose = (...fns) => async (value, ...args) => {
    let result = value;
    const reversedFns = fns.slice().reverse();
    for (let i = 0; i < reversedFns.length; i += 1) {
        const fn = reversedFns[i];
        result = await fn(result, ...args);
    }
    return result;
};

/**
 * Capitalize first letter of each word
 *
 * @param value - Any string
 * @returns Capitalized string
 */
const capitalize = (value) => {
    if (!value)
        return value;
    return value.replace(/(^|\s)\S/g, (l) => l.toUpperCase());
};

/**
 * Casts value to array
 *
 * @template T - The type of the value.
 * @param value - The value to cast into an array.
 * @returns An array containing the given value.
 */
const castArray = (value) => {
    return Array.isArray(value) ? value : [value];
};

/**
 * Performs right-to-left function composition
 *
 * @param fns - Functions
 * @returns Composed function
 */
const compose = (...fns) => (value, ...args) => {
    let result = value;
    const reversedFns = fns.slice().reverse();
    for (let i = 0; i < reversedFns.length; i += 1) {
        const fn = reversedFns[i];
        result = fn(result, ...args);
    }
    return result;
};

/**
 * Drops the last element from an array.
 *
 * @template T
 * @param  array - The array to drop the last element from
 * @returns - The new array with the last element dropped
 */
const dropLast = (array) => array.slice(0, array.length - 1);

/**
 * Applies a set of transformations to an object and returns a new object with the transformed values.
 *
 * @template T
 * @param transformations - The transformations to apply.
 * @param object - The object to transform.
 * @returns The transformed object.
 */
function evolve(transformations, object) {
    const result = {};
    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        const transformation = transformations[key];
        if (typeof transformation === 'function') {
            result[key] = transformation(object[key]);
        }
        else {
            result[key] = object[key];
        }
    }
    return result;
}

/**
 * Checks if a value is null or undefined.
 *
 * @template T - The type of the value.
 * @param value - The value to check
 * @returns True if the value is null or undefined, false otherwise
 */
const isNil = (value) => value === null || value === undefined;

/**
 * Retrieves the value at a given path from an object.
 *
 * @param target - The object to retrieve the value from.
 * @param path - The path of the value to retrieve.
 * @param defaultValue - The default value to return if the path does not exist.
 * @returns The value at the given path, or the default value if the path does not exist.
 */
const get = (target, path, defaultValue) => {
    if (isNil(target))
        return defaultValue;
    const _path = castArray(path);
    let result = target;
    for (let i = 0; i < _path.length; i += 1) {
        if (isNil(result))
            return undefined;
        result = result[_path[i]];
    }
    return isNil(result) ? defaultValue : result;
};

function last(value) {
    return value === '' ? '' : value[value.length - 1];
}

/**
 * Maps over the values of an object and applies a function to each value.
 *
 * @param object - The object to map over
 * @param fn - The function to apply to each value
 * @returns A new object with the mapped values
 */
const mapValues = (object, fn) => {
    const entries = Object.entries(object);
    const acc = {};
    return entries.reduce((acc, [key, value], index) => {
        acc[key] = fn(value, key, index);
        return acc;
    }, acc);
};

const isPercent = (value) => /((-)?\d+\.?\d*)%/g.exec(`${value}`);
/**
 * Get percentage value of input
 *
 * @param value
 * @returns Percent value (if matches)
 */
const matchPercent = (value) => {
    const match = isPercent(value);
    if (match) {
        const f = parseFloat(match[1]);
        const percent = f / 100;
        return { percent, value: f };
    }
    return null;
};

/**
 * Creates a new object by omitting specified keys from the original object.
 *
 * @param keys - The key or keys to omit
 * @param object - The original object
 * @returns The new object without the omitted keys
 */
const omit = (keys, object) => {
    const _keys = castArray(keys);
    const copy = Object.assign({}, object);
    _keys.forEach((key) => {
        delete copy[key];
    });
    return copy;
};

/**
 * Picks the specified keys from an object and returns a new object with only those keys.
 *
 * @param keys - The keys to pick from the object
 * @param object - The object to pick the keys from
 * @returns A new object with only the picked keys
 */
const pick = (keys, obj) => {
    const result = {};
    for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        if (key in obj)
            result[key] = obj[key];
    }
    return result;
};

/**
 * Repeats an element a specified number of times.
 *
 * @template T
 * @param element - Element to be repeated
 * @param length - Number of times to repeat element
 * @returns Repeated elements
 */
const repeat = (element, length = 0) => {
    const result = new Array(length);
    for (let i = 0; i < length; i += 1) {
        result[i] = element;
    }
    return result;
};

/**
 * Reverses the list
 *
 * @template T
 * @param list - List to be reversed
 * @returns Reversed list
 */
const reverse = (list) => Array.prototype.slice.call(list, 0).reverse();

/**
 * Capitalize first letter of string
 *
 * @param value - String
 * @returns Capitalized string
 */
const upperFirst = (value) => {
    if (!value)
        return value;
    return value.charAt(0).toUpperCase() + value.slice(1);
};

/**
 * Returns a new array with all the values from the original array that are not present in the keys array.
 *
 * @param keys - The keys to pick from the object
 * @param array - Array to filter the values from
 * @returns A new array with without the omitted values
 */
const without = (keys, array) => {
    const result = [];
    for (let i = 0; i < array.length; i += 1) {
        const value = array[i];
        if (!keys.includes(value))
            result.push(value);
    }
    return result;
};

/**
 * Parse a string or number to a float
 *
 * @param value - String or number
 * @returns Parsed float
 */
const parseFloat$1 = (value) => {
    return typeof value === 'string' ? Number.parseFloat(value) : value;
};

export { adjust, asyncCompose, capitalize, castArray, compose, dropLast, evolve, get, isNil, last, mapValues, matchPercent, omit, parseFloat$1 as parseFloat, pick, repeat, reverse, upperFirst, without };
