export interface ArticleIndex {

    id: number;

    /**
     * 创建时间
     */
    createTime: Date | string;

    /**
     * 更新时间
     */
    updateTime: Date | string;

    /**
     * 文章名称
     */
    name: string;

    /**
     * 分类
     */
    categoryId: number | null;

    /**
     * 文章标签
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
     * 所属文件夹
     */
    folder: number;

    /**
     * 是否是预览模式
     */
    preview: boolean;

}
export function getDefaultArticleIndex(source?: Partial<ArticleIndex>): ArticleIndex {
    return Object.assign({
        id: 0,
        createTime: new Date(),
        updateTime: new Date(),
        name: '',
        categoryId: null,
        tags: [],
        description: '',
        source: '',
        folder: 0,
        preview: false,
    }, source);
}
