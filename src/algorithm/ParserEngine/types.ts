export interface ParserEngine {

    /**
     * 根据规则解析为字符串
     * @param select 规则
     */
    parseToString(select: string): string;

    /**
     * 根据规则解析为引擎数组，每个元素为一个引擎实例
     * @param select 规则
     */
    parseToEngines(select: string): Array<ParserEngine>;

    /**
     * 解析正则列表
     * @param regex 正则表达式
     * @param selects 选择器列表
     * @deprecated 请使用 parseToString
     */
    parseRegexToStrings(regex: string, selects: Array<string | undefined>): Array<Array<string>>;

    /**
     * 将当前内容转为字符串
     */
    toString(): string;

    /**
     * 将当前内容转为 HTML 字符串，包含元素本身
     */
    toHTML(): string;

    /**
     * 将当前内容转为 HTML 字符串，不包含元素本身
     */
    toInnerHTML(): string;

}

export interface ParseResult {
    // 解析到的全部元素
    elements: Array<Element>;
    // 最后一个选择器
    last: string;
}

