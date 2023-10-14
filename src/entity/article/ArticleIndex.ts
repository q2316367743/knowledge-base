import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";

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
    categoryId?: number;

    /**
     * 所属文件夹
     */
    folder: number;

    /**
     * 是否是预览模式
     */
    preview: boolean;

    /**
     * 文章类型
     */
    type: ArticleTypeEnum;

}

export function getDefaultArticleIndex(source?: Partial<ArticleIndex>): ArticleIndex {
    return Object.assign({
        id: 0,
        createTime: new Date(),
        updateTime: new Date(),
        name: '',
        categoryId: null,
        folder: 0,
        preview: false,
        type: ArticleTypeEnum.MARKDOWN
    }, source);
}
