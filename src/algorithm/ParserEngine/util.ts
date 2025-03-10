import {ParseResult} from "@/algorithm/ParserEngine/types";
import {getParseStrategy} from "@/algorithm/ParserEngine/strategy";

/**
 * 解析一组element，返回一组element
 *
 * 此处是解析的核心
 * @param select
 * @param elements
 */
export function parseCoreElements(select: string, elements: Array<Element>): Array<Element> {
    if (!elements || elements.length === 0) {
        return new Array<Element>();
    }

    const strategy = getParseStrategy(select);

    return strategy.handler(select, elements);
}

/**
 * 解析一组索引元素
 *
 * 此处检查索引
 * @param select
 * @param elements
 */
export function parseIndexElements(select: string, elements: Array<Element>): Array<Element> {
    if (!elements || elements.length === 0) {
        return new Array<Element>();
    }

    //
    // 先处理索引

    let start = 0;
    let end = -1;
    let step = 1;
    // 忽略的索引
    let ignoreIndexes = new Array<number>();
    let matchIndexes = new Array<number>();

    if (/\.-?\d+$/.test(select)) {
        // 最普通的，只看某一个元素，
        // 比如.1，或者.2
        select = select.replaceAll(/\.-?\d+$/g, substring => {
            if (substring.startsWith(".-")) {
                matchIndexes.push(parseInt(substring.substring(2)));
            } else {
                matchIndexes.push(parseInt(substring.substring(1)));
            }
            return '';
        });
    } else if (/\[[\-!\d,]+]/.test(select)) {
        // 匹配或忽略一些元素，优先级比下面高
        // 比如[1,2,3]
        // [1,2,3,!4,5]
        select = select.replaceAll(/\[[\-!\d,]+]/g, substring => {
            let strings = substring.substring(1, substring.length - 1).split(":");
            for (let string of strings) {
                if (string.startsWith("!")) {
                    ignoreIndexes.push(parseInt(string.substring(1)));
                } else {
                    matchIndexes.push(parseInt(string));
                }
            }
            return '';
        });
    } else if (/\[-?\d+:-?\d+:-?\d+]|\[-?\d+]|\[-?\d+:-?\d+]/.test(select)) {
        // 有可能是xpath，要判断一下
        // 比如[1:2:3]，[1:2]，[1]：[1:2:3]表示从1开始，到2结束，步长为3
        // [1:2]表示从1开始，到2结束，步长为1
        // 还有可能是!1:2表示忽略1和2
        if (!select.startsWith("//")) {
            // 只要某个区间的元素
            select = select.replaceAll(/\[-?\d+:-?\d+:-?\d+]|\[-?\d+]|\[-?\d+:-?\d+]/g, substring => {
                let strings = substring.substring(1, substring.length - 1).split(":");
                start = parseInt(strings[0] || '0');
                end = parseInt(strings[1] || '-1');
                step = parseInt(strings[2] || '1');
                return '';
            });
        }
    } else if (/!-?\d+(:-?\d+)*/.test(select)) {
        // 忽略一些元素，忽略的索引
        // 比如!1:2
        // !1:2:3
        select = select.replaceAll(/!-?\d+(:-?\d+)*/g, substring => {
            let indexes = substring.substring(1).split(":");
            indexes.forEach(index => ignoreIndexes.push(parseInt(index)));
            return '';
        });
    }

    let results = parseCoreElements(select, elements);

    if (end < 0) {
        end = results.length + 1 + end;
    }

    const items = new Array<Element>();

    // 匹配规则
    matchIndexes = matchIndexes.map(e => {
        if (e < 0) {
            return results.length + e;
        }
        return e;
    });
    // 忽略规则
    ignoreIndexes = ignoreIndexes.map(e => {
        if (e < 0) {
            return results.length + e;
        }
        return e;
    });

    if (start === -1 && end === 0) {
        // 直接反转
        items.push(...results.reverse());
    }

    for (let i = start; i < end; i += step) {
        if (ignoreIndexes.includes(i)) {
            // 包含忽略的
            continue;
        }
        if (matchIndexes.length === 0 || matchIndexes.includes(i)) {
            // 如果没有匹配规则，或者匹配规则存在此索引
            items.push(results[i]);
        }
    }

    return items;
}

/**
 * 解析分隔符元素
 * @param select 选择器
 * @param elements 元素
 */
function parseSplitElements(select: string, elements: Array<Element>): ParseResult {

    // 默认选择器
    let strings = select.split("@");
    let last = select;
    if (strings.length > 1) {
        last = strings[strings.length - 1];
        for (let i = 0; i < strings.length - 1; i++) {
            // 解析
            elements = parseIndexElements(strings[i], elements);
        }
    }

    return {elements, last};
}

function parseSplitElementsToString(select: string, elements: Array<Element>): string {
    return parseLastNodeToString(parseSplitElements(select, elements))
}


/**
 * 解析分隔符元素
 * @param select 选择器
 * @param elements 元素
 */
function parseSplitElementsToElement(select: string, elements: Array<Element>): Array<Element> {
    // 默认选择器
    let strings = select.split("@");
    for (let i = 0; i < strings.length; i++) {
        // 解析
        elements = parseIndexElements(strings[i], elements);
    }

    return elements;
}

interface ParseConnectorElementsOption<R> {
    parseSplitElements: (select: string, elements: Array<Element>) => R,
    defaultValue: R,
    merge: (items: Array<R>) => R;
    turn: (items: Array<R>) => R;
}

/**
 * 解析连接器元素
 *
 * 此处检查与和或
 * @param select
 * @param elements
 * @param option 参数
 */
export function parseConnectorElements<R>(
    select: string, elements: Array<Element>, option: ParseConnectorElementsOption<R>): R {
    if (!elements || elements.length === 0) {
        return option.defaultValue;
    }


    // 取第一个有值的
    const or = select.split("||");
    if (or.length > 1) {
        for (let string of or) {
            const results = parseConnectorElements<R>(string, elements, option);
            if (results) {
                return results;
            }
        }
        // 如果都没有，返回空数组
        return option.defaultValue;
    }
    // 此处可能存在&&或者||
    const and = select.split("&&");
    if (and.length > 1) {
        const results = new Array<R>();
        for (let item of and) {
            results.push(parseConnectorElements<R>(item, elements, option));
        }
        return option.merge(results);
    }
    // 依次获取
    const turn = select.split("%%");
    if (turn.length > 1) {
        const results = new Array<R>();
        for (let item of turn) {
            results.push(parseConnectorElements<R>(item, elements, option));
        }
        return option.turn(results);
    }

    // 默认的
    return option.parseSplitElements(select, elements);
}


/**
 * 解析连接器元素为字符串
 *
 * 此处检查与和或
 * @param select
 * @param elements
 */
export function parseConnectorElementsToString(select: string, elements: Array<Element>): string {
    return parseConnectorElements<string>(select, elements, {
        defaultValue: '',
        parseSplitElements: parseSplitElementsToString,
        merge: items => {
            return items.join(",")
        },
        turn: items => {
            return items.join(",")
        },
    });
}

function turnElements(items: Array<Array<Element>>): Array<Element> {
    const max = Math.max(...items.map(e => e.length));
    const res = new Array<Element>();
    for (let i = 0; i < max; i++) {
        for (let item of items) {
            item[i] && res.push(item[i]);
        }
    }
    return res;
}

/**
 * 解析连接器元素为字符串
 *
 * 此处检查与和或
 * @param select
 * @param elements
 */
export function parseConnectorElementsToElements(select: string, elements: Array<Element>): Array<Element> {
    return parseConnectorElements<Array<Element>>(select, elements, {
        defaultValue: [],
        parseSplitElements: parseSplitElementsToElement,
        merge: items => items.flatMap(e => e),
        turn: turnElements,
    });
}

/**
 * 解析连接器元素为字符串
 *
 * 此处检查与和或
 * @param select
 * @param elements
 */
export function parseXpathElementsToString(select: string, elements: Array<Element>): string {
    return parseConnectorElements<string>(select, elements, {
        defaultValue: '',
        parseSplitElements: (select: string, elements: Array<Element>) => {
            const items = new Array<string>();
            for (let element of elements) {
                let xPathResult = document.evaluate(select, element);
                items.push(xPathResult.stringValue);
            }
            return items.join('');
        },
        merge: items => {
            return items.join("")
        },
        turn: items => {
            return items.join("")
        },
    });
}

/**
 * 解析连接器元素为字符串
 *
 * 此处检查与和或
 * @param select
 * @param elements
 */
export function parseXpathElementsToElements(select: string, elements: Array<Element>): Array<Element> {
    return parseConnectorElements<Array<Element>>(select, elements, {
        defaultValue: [],
        parseSplitElements: (select: string, elements: Array<Element>) => {
            const items = new Array<Element>();
            for (let element of elements) {
                let xPathResult = document.evaluate(select, element, null, XPathResult.ANY_TYPE, null);
                let node = xPathResult.iterateNext();
                while (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        items.push(node as Element);
                    }
                    node = xPathResult.iterateNext();
                }
            }
            return items;
        },
        merge: items => {
            return items.flatMap(e => e)
        },
        turn: turnElements,
    });
}

/**
 * 解析最后一个节点为字符串
 * @param result 最后一个节点的信息
 */
export function parseLastNodeToString(result: ParseResult): string {
    const {last, elements} = result;
    // 此处可能出现js代码
    let text = last;
    // {{ 属性 }}|{{ 分隔符 }}
    const lastItems = last.split('|');
    const attr = lastItems[0];
    const join = lastItems[1] || '\n';
    if (attr === 'text') {
        text = elements.map(element => element.textContent || '').join(join);
    } else if (last === 'textNodes') {
        const lines = new Array<string>();
        for (let element of elements) {
            for (let i = 0; i < element.childNodes.length; i++) {
                const textContent = element.childNodes.item(i).textContent || '';
                if (textContent) {
                    lines.push(textContent);
                }
            }
        }
        text = lines.join(join);
    } else if (attr === 'html') {
        text = elements.map(element => element.outerHTML || '').join(join);
    } else if (attr === 'innerHTML') {
        text = elements.map(element => element.innerHTML || '').join(join);
    } else if (attr === 'all') {
        text = elements.map(element => element.outerHTML || '').join(join);
    } else {
        try {
            text = elements.map(element => element.getAttribute(last) || '').join(join);
        } catch (e) {
            console.error(e);
        }
    }
    return text;
}

/**
 * 解析正则规则
 * @param regex 正则表达式
 * @param selects 每一项选择器：$1、$2...
 * @param text 文本
 */
export function parseRegexToStrings(regex: string, selects: Array<string | undefined>, text: string): Array<Array<string>> {
    const results = new Array<Array<string>>();
    const lines = text.split("\n");
    const listRegex = new RegExp(regex, 'g');
    for (let line of lines) {
        const match = listRegex.exec(line)
        if (match) {
            const result = new Array<string>();
            // 这行匹配到了
            for (let select of selects) {
                if (select) {
                    // 判断是$1还是正则
                    if (select.toUpperCase() === 'FULL') {
                        result.push(match[0] || '');
                    } else if (/^\$\d+$/.test(select)) {
                        // $1
                        const index = parseInt(select.substring(1));
                        result.push(match[index] || '');
                    } else {
                        // 正则表达式
                        let item = match[0].match(new RegExp(select));
                        if (item) {
                            result.push(item.join(''));
                        } else {
                            result.push('');
                        }
                    }
                } else {
                    result.push('');
                }
            }
            results.push(result);
        }
    }
    return results;
}
