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
     *
     * @default ArticleTypeEnum.MARKDOWN
     */
    type: ArticleTypeEnum;

    /**
     * 是否是删除的
     */
    isDelete: boolean;

}

export function getDefaultArticleIndex(source?: Partial<ArticleIndex>): ArticleIndex {
    return Object.assign<ArticleIndex, Partial<ArticleIndex>>({
        id: 0,
        createTime: new Date(),
        updateTime: new Date(),
        name: '',
        folder: 0,
        preview: false,
        type: ArticleTypeEnum.MARKDOWN,
        isDelete: false
    }, source || {});
}
