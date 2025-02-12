import {isEmptyString, isNotEmptyString} from "@/utils/lang/FieldUtil";

/**
 * 执行异步替换
 * @param text 要替换的文本
 * @param regex 替换正则
 * @param asyncReplacement 一步替换函数
 */
export async function asyncReplaceAll(
    text: string, regex: RegExp, asyncReplacement: (substring: string) => Promise<string>): Promise<string> {
    const matches = text.match(regex);

    if (!matches) {
        return text;
    }

    const replacedTextArray = await Promise.all(matches.map(asyncReplacement));

    let index = 0;
    return text.replace(regex, () => replacedTextArray[index++]);
}


export function ellipsis(str: string, max = 20, footer = '...'): string {
    if (isNotEmptyString(str)) {
        if (str.length > max) {
            return str.substring(0, max) + footer;
        }
    }
    return str;
}

/**
 * 标记关键字
 * @param str 模板
 * @param keyword 关键字
 */
export function mark(str: string, keyword: string): string {
    if (isEmptyString(str) || isEmptyString(keyword)) {
        return str;
    }
    const index = str.indexOf(keyword);
    if (index > -1) {
        str = `${str.substring(0, index)}<mark>${keyword}</mark>${str.substring(index + keyword.length)}`;
    }
    return str;
}

export function reverseString(str: string): string {
    return str.split("").reverse().join("");
}
