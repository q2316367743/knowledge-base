export default interface ArticleImport {

    /**
     * 标题
     */
    title: string;

    /**
     * 内容
     */
    content: string;

    /**
     * 来源
     */
    source?: string;

    /**
     * 来源
     */
    sourceUrl?: string;

    /**
     * 标签
     */
    tags?: Array<string>;

    /**
     * 描述
     */
    description?: string;

}
