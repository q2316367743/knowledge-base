import {Dayjs} from "dayjs";

export function isJSON(str: string) {
  return /^[\],:{}\s]*$/.test(str
    .replace(/\\["\\\/bfnrtu]/g, '@')
    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''));
}

export function isNull(value?: any): boolean {
  return typeof value === "undefined" || value === null;
}

export function isNotNull(value?: any): boolean {
  return !isNull(value);
}


/**
 * 是否是空字符串
 * @param str
 */
export function isEmptyString(str?: any): boolean {
  if (!str) {
    return true;
  }
  if (typeof str !== 'string') {
    return true;
  }
  return str.trim() === '';
}

export function isNotEmptyString(str?: string) {
  return !isEmptyString(str);
}

export function isEmptyArray(arr?: Array<any>): boolean {
  if (!arr) {
    return true;
  }
  if (!Array.isArray(arr)) {
    return true;
  }
  return arr.length === 0;
}

export function isNotEmptyArray(arr?: Array<any>): boolean {
  return !isEmptyArray(arr);
}

/**
 * If value is null or undefined, return default value.
 * @param value 检测值
 * @param defaultValue 默认值
 */
export function defaultIfNull<T>(value: T | null | undefined, defaultValue: T): T {
  return value && isNotNull(value) ? value : defaultValue;
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

export function versionCompare(version1: string, version2: string): number {
  const v1 = version1.split('.').map(Number);
  const v2 = version2.split('.').map(Number);
  for (let i = 0; i < v1.length; i++) {
    if (v1[i] > v2[i]) {
      return 1;
    } else if (v1[i] < v2[i]) {
      return -1;
    }
  }
  return 0;
}

export function isVersionUpdate(newVersion: string, oldVersion: string, minVersion: string): boolean {
  // 新版本必须大于等于最小版本，旧版本必须小于最小版本
  return versionCompare(newVersion, minVersion) >= 0 && versionCompare(oldVersion, minVersion) < 0;
}

/**
 * 获取一个值小于最大值，大于最小值
 */
export function getValueBetween(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * 版本是否小于指定版本
 * @param version 版本
 * @param levels 指定版本
 */
export function versionLess(version: string, ...levels: Array<number>): boolean {
  const v = version.split('.');
  if (!v.length) return false;
  for (let i = 0; i < levels.length; i++) {
    if (parseInt(v[i] || '0') < levels[i]) {
      return true;
    }
  }
  return false;
}

/**
 * 版本是否大于等于指定版本
 * @param version 版本
 * @param levels 指定版本
 */
export function versionGreaterEqual(version: string, ...levels: Array<number>): boolean {
  return !versionLess(version, ...levels);
}

export function toDayOfBegin(day: Dayjs): Dayjs{
  return day.set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0);
}
export function toDayOfEnd(day: Dayjs): Dayjs{
  return day.set('hour', 0).set('minute', 0).set('second', 0).set('millisecond', 0).add(1, 'day').subtract(1, 'second');
}

/**
 * 根据索引获取编号，编号从A开始，26进制，27使用AA表示，以此类推
 * @param index
 */
export function getNo(index: number): string {
  let result = '';
  while (index >= 0) {
    result = String.fromCharCode((index % 26) + 65) + result;
    index = Math.floor(index / 26) - 1;
  }
  return result;
}

/**
 * 生成指定长度的随机字符串
 * @param length 字符串长度
 */
export function randomString(length: number): string {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function deepClone<T>(obj: T): T {
    // 检查是否为 null 或 undefined
    if (obj === null || obj === undefined) {
        return obj;
    }

    // 检查是否为日期对象
    if (obj instanceof Date) {
        return new Date(obj.getTime()) as any;
    }

    // 检查是否为正则表达式对象
    if (obj instanceof RegExp) {
        return new RegExp(obj) as any;
    }

    // 检查是否为对象或数组
    if (typeof obj === 'object') {
        const cloneObj = Array.isArray(obj) ? [] : {};

        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                // 递归克隆每个属性
                (cloneObj as any)[key] = deepClone((obj as any)[key]);
            }
        }

        return cloneObj as T;
    }

    // 如果不是对象或数组，直接返回
    return obj;
}

