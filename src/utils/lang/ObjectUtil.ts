/**
 * 深度合并对象
 * @param initial 初始值
 * @param source 源值
 * @returns 合并后的对象
 */
export function assignDeep<T extends Record<string, any>>(initial: T, source?: any | null): T {
    if (!source) {
        return initial;
    }
    for (let initialKey in initial) {
        const own = initial[initialKey];
        const target = source[initialKey];
        // 不等于undefined，说明有值，更加准确
        if (typeof target !== 'undefined') {
            if (typeof own === 'object') {
                if (Array.isArray(own)) {
                    if (Array.isArray(target)) {
                        initial[initialKey] = target.concat(own) as any;
                    } else {
                        initial[initialKey] = [target].concat(own) as any;
                    }
                } else {
                    initial[initialKey] = assignDeep(initial[initialKey], source[initialKey]);
                }
            } else if (typeof own === typeof target) {
                // 类型相同，直接赋值
                initial[initialKey] = target;
            }
        }
    }
    return initial;
}

const SERIALIZE_KEY = '__serialize__';

/**
 * 序列化对象
 * @param obj 对象
 * @returns 序列化后的字符串
 */
export function serialize(obj: Record<string, any>): string {
    let result = `const ${SERIALIZE_KEY} = new Object();`;

    function serializeInternal(o: Record<string, any>, path: string) {
        for (const p in o) {
            const value = o[p];
            if (typeof value !== "object") {
                if (typeof value === "string") {
                    result += "\n" + path + "[" + ("\"" + p + "\"") + "] = " + "\"" + value.replace(/"/g, "\\\"") + "\"" + ";";
                } else {
                    result += "\n" + path + "[" + ("\"" + p + "\"") + "] = " + value + ";";
                }
            } else {
                if (Array.isArray(value)) {
                    result += "\n" + path + "[" + ("\"" + p + "\"") + "]" + "=" + "new Array();";
                    serializeInternal(value, path + "[" + ("\"" + p + "\"") + "]");
                } else {
                    result += "\n" + path + "[" + ("\"" + p + "\"") + "]" + "=" + "new Object();";
                    serializeInternal(value, path + "[" + ("\"" + p + "\"") + "]");
                }
            }
        }
    }

    serializeInternal(obj, SERIALIZE_KEY);
    result += "\nreturn " + SERIALIZE_KEY + ";";
    return result;
}

/**
 * 反序列化对象
 * @param str 序列化后的字符串
 * @returns 反序列化后的对象
 */
export function deserialize<T extends Record<string, any>>(str: string): T {
    const obj = new Function(str);
    return obj();
}


/**
 * 深拷贝对象
 * @param obj
 */
export function deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    if (Array.isArray(obj)) {
        const arrClone = [] as any[]
        for (const item of obj) {
            arrClone.push(deepClone(item))
        }
        return arrClone as T
    }

    const objClone = {} as { [key: string]: any }
    for (const key in obj) {
        if (Object.hasOwn(obj, key)) {
            objClone[key] = deepClone((obj as { [key: string]: any })[key])
        }
    }
    return objClone as T
}

export function clone<T = any>(obj: T, deep = false): T {
    if (deep) {
        return deepClone(obj);
    }
    return structuredClone(obj);
}
