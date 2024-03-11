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

export function handleDate(date: Date | string | number) {
    const old = new Date(date);
    const today = new Date();
    const diffTime = old.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return `过期了${Math.abs(diffDays)}天`;
    } else if (diffDays <= 7) {
        const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        const dayOfWeek = daysOfWeek[old.getDay()];

        if (old.getDay() > today.getDay() || old.getDay() === 0) {
            return `本${dayOfWeek}`;
        } else {
            return `下${dayOfWeek}`;
        }
    } else {
        return `还有${diffDays}天`;
    }
}
