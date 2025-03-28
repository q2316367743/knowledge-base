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
 * 版本是否大于指定大版本
 * @param version 版本
 * @param level 指定大版本
 */
export function versionGreaterEqual(version: string, level: number): boolean {
  const v = version.split('.')[0];
  if (!v) return false;
  return parseInt(v) >= level;
}

/**
 * 版本是否小于指定大版本
 * @param version 版本
 * @param level 指定大版本
 */
export function versionLess(version: string, level: number): boolean {
  const v = version.split('.')[0];
  if (!v) return false;
  return parseInt(v) < level;
}
