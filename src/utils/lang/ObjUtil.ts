/**
 * If value is null or undefined, return default value.
 * @param value 检测值
 * @param defaultValue 默认值
 */
export function ifNullByDefault<T>(value: T | null | undefined, defaultValue: T): T {
    return value === null || typeof value === 'undefined' ? defaultValue : value;
}

/**
 * If object is null or undefined, return default value.
 * @param value
 * @param attr
 * @param defaultValue
 */
export function ifObjectIsNull<T extends Record<string, any>, A extends T[K], K extends keyof T>(value: T | null | undefined, attr: K, defaultValue: A): A {
    if (value) {
        return value[attr] ?? defaultValue;
    } else {
        return defaultValue;
    }
}

export function clone(obj: any, deep = false) {
    if (deep) {
        return JSON.parse(JSON.stringify(obj));
    }
    return structuredClone(obj);
}
