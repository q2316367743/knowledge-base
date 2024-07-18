import dayjs from "dayjs";

export const KB = 1024.0;
export const MB = 1024 * KB;
export const GB = 1024 * MB;

/**
 * 美化数据单位
 *
 * @param {number} value 需要美化的值
 */
export function prettyDataUnit(value: number) {
    if (value > GB) {
        let temp = value / GB;
        return temp.toFixed(2) + 'GB';
    }
    if (value > MB) {
        let temp = value / MB;
        return temp.toFixed(2) + 'MB';
    }
    if (value > KB) {
        let temp = value / KB;
        return temp.toFixed(2) + 'KB';
    }
    return value + 'B';

}

export function prettyDate(date?: number | string | Date) {
    const now = new Date().getTime()
    const old = date ? new Date(date).getTime() : new Date().getTime()
    const diffValue = now - old;
    let result: string
    const minute = 1000 * 60
    const hour = minute * 60
    const day = hour * 24
    const month = day * 30
    const year = month * 12

    const _year = diffValue / year
    const _month = diffValue / month
    const _week = diffValue / (7 * day)
    const _day = diffValue / day
    const _hour = diffValue / hour
    const _min = diffValue / minute

    if (_year >= 1) result = _year.toFixed(0) + "年前"
    else if (_month >= 1) result = _month.toFixed(0) + "个月前"
    else if (_week >= 1) result = _week.toFixed(0) + "周前"
    else if (_day >= 1) result = _day.toFixed(0) + "天前"
    else if (_hour >= 1) result = _hour.toFixed(0) + "个小时前"
    else if (_min >= 1) result = _min.toFixed(0) + "分钟前"
    else result = "刚刚"
    return result
}

export function handleDate(date: Date | string | number) {
    const old = new Date(date);
    const today = new Date();
    const diffTime = old.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return `过期了${Math.abs(diffDays)}天`;
    }else if (diffDays <= 7) {

        if (today.getDate() === old.getDate()) {
            return "今天"
        }else if (old.getDate() - today.getDate() === 1) {
            return "明天"
        }

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

export function toDateString(date: number | string | Date, format = 'YYYY-MM-DD HH:mm:ss') {
    return dayjs(date).format(format);
}
