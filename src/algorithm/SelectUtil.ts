export function parseSelectWithJsCode(select: string, map: (str: string) => string): string {
    let js = '';
    // 解析select语句中的js代码
    if (select.includes("@js:")) {
        // 存在js代码
        const idx = select.indexOf("@js:")
        js = select.substring(idx + 4);
        select = select.substring(0, idx);
    }
    let result: string;
    // 执行映射
    if (select) {
        // 存在规则时才进行映射
        result = map(select);
    }else {
        result = '';
    }
    // 最后处理js代码
    if (js) {
        // js代码处理
        try {
            result = eval(js) || result;
        } catch (e) {
            console.error(e);
        }
    }
    return result;
}

export function parseSelectWithReplace(select: string, map: (str: string) => string): string {
    let match = '';
    let replace = '';
    // 其次是替换规则
    select = select.replaceAll(/##.*(##)?.*$/g, substring => {
        const items = substring.split("##").filter(e => e.trim());
        match = items[0] || '';
        replace = items[1] || '';
        return '';
    });

    let result = map(select);

    // 如果有替换规则，则进行替换
    if (match) {
        result = result.replaceAll(new RegExp(match, 'g'), replace);
    }

    return result;
}
