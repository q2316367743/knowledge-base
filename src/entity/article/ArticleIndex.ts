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
    categoryId: number;

    /**
     * 文章标签
     */
    tags: string[];

    /**
     * 描述，限制64个字
     */
    description: string;

}
