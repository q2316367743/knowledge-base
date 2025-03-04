/**
 * 笔记基础信息
 */
export interface ArticleBase {

    /**
     * 笔记标签
     */
    tags: string[];

    /**
     * 描述，限制64个字
     */
    description: string;

    /**
     * 来源，最多32个字
     */
    source: string;

    /**
     * 源链接
     */
    sourceUrl: string;

}

export function getDefaultArticleBase(source?: Partial<ArticleBase>): ArticleBase {
    return Object.assign<ArticleBase, Partial<ArticleBase> | undefined>({
        tags: [],
        description: '',
        source: '',
        sourceUrl: '',
    }, source);
}

