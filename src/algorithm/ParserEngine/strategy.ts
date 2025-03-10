// 解析策略
export interface ParseStrategy {
    sign: string;

    handler(select: string, elements: Array<Element>): Array<Element>;
}

// 默认解析策略
const DefaultParseStrategy: ParseStrategy = {
    sign: '',
    handler(select: string, elements: Array<Element>): Array<Element> {
        // ID选择器
        const results = new Array<Element>();
        for (let element of elements) {
            let elementNodeListOf = element.querySelectorAll(select);
            for (let i = 0; i < elementNodeListOf.length; i++) {
                const el = elementNodeListOf.item(i);
                if (el) results.push(el);
            }
        }
        return results;
    }
}

// 自身解析策略
const SelfParseStrategy: ParseStrategy = {
    sign: 'self',
    handler(_select: string, elements: Array<Element>): Array<Element> {
        return elements;
    }
}

// 标签解析策略
const TagParseStrategy: ParseStrategy = {
    sign: 'tag.',
    handler(select: string, elements: Array<Element>): Array<Element> {
        // 标签选择器
        const results = new Array<Element>();
        const tag = select.substring(4);
        for (let element of elements) {
            const elementsByTagName = element.getElementsByTagName(tag);
            for (let i = 0; i < elementsByTagName.length; i++) {
                const el = elementsByTagName.item(i);
                if (el) results.push(el);
            }
        }
        return results;
    }
}

// 类解析策略
const ClassParseStrategy: ParseStrategy = {
    sign: 'class.',
    handler(select: string, elements: Array<Element>): Array<Element> {
        // 类选择器
        const results = new Array<Element>();
        const tag = select.substring(6);
        for (let element of elements) {
            const elementsByTagName = element.getElementsByClassName(tag);
            for (let i = 0; i < elementsByTagName.length; i++) {
                const el = elementsByTagName.item(i);
                if (el) results.push(el);
            }
        }
        return results;
    }
}

// ID解析策略
const IdParseStrategy: ParseStrategy = {
    sign: 'id.',
    handler(select: string, elements: Array<Element>): Array<Element> {
        const results = new Array<Element>();
        const tag = select.substring(3);
        for (let element of elements) {
            const elementsByTagName = element.querySelectorAll(`#${tag}`);
            for (let i = 0; i < elementsByTagName.length; i++) {
                const el = elementsByTagName.item(i);
                if (el) results.push(el);
            }
        }
        return results;
    }
}

// 文字解析策略
const TextParseStrategy: ParseStrategy = {
    sign: 'text.',
    handler(select: string, elements: Array<Element>): Array<Element> {
        const results = new Array<Element>();
        const tag = select.substring(5);
        function parse(eleItems: HTMLCollection, res: Array<Element>) {
            for (let i = 0; i < eleItems.length; i++) {
                const ele = eleItems.item(i);
                if (ele) {
                    if ((ele.textContent || '').trim() === tag) {
                        res.push(ele);
                    }
                    parse(ele.children, res);
                }
            }
        }

        for (let element of elements) {
            if ((element.textContent || '').trim() === tag) {
                results.push(element);
            }
            parse(element.children, results);
        }
        return results;
    }
}

// 子元素解析策略
const ChildrenParseStrategy: ParseStrategy = {
    sign: 'children',
    handler(_select: string, elements: Array<Element>): Array<Element> {
        // ID选择器
        const results = new Array<Element>();
        for (let element of elements) {
            for (let i = 0; i < element.children.length; i++) {
                const el = element.children.item(i);
                if (el) results.push(el);
            }
        }
        return results;
    }
}

const XpathParseStrategy: ParseStrategy = {
    sign: '//',
    handler(select: string, elements: Array<Element>): Array<Element> {
        // ID选择器
        const results = new Array<Element>();
        for (let element of elements) {
            let xPathResult = document.evaluate(select, element, null, XPathResult.ANY_TYPE, null);
            let node = xPathResult.iterateNext();
            while (node) {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    results.push(node as Element);
                }
                node = xPathResult.iterateNext();
            }
        }
        return results;
    }
}

const strategies = [TagParseStrategy, ClassParseStrategy, IdParseStrategy,
    ChildrenParseStrategy, TextParseStrategy, XpathParseStrategy, SelfParseStrategy];

/**
 * 获取一个解析策略
 * @param select 选择器
 */
export function getParseStrategy(select: string): ParseStrategy {
    if (select === '') {
        // 如果是空选择器，就是子节点解析策略
        return ChildrenParseStrategy;
    }
    for (let strategy of strategies) {
        if (select.startsWith(strategy.sign)) {
            return strategy
        }
    }
    // 默认解析策略
    return DefaultParseStrategy;
}
