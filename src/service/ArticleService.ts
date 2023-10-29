import {DbList} from "@/utils/utools/DbStorageUtil";
import {ArticleBase, ArticleIndex} from "@/entity/article";

export default interface ArticleService {

    /**
     * 查询全部文章
     * @returns 全部文章
     */
    list(): Promise<DbList<ArticleIndex>>

    /**
     * 保存全部文章
     * @param items 全部文章
     * @param rev 版本号
     */
    save(items: Array<ArticleIndex>, rev?: string): Promise<string | undefined>;

    /**
     * 新增文章
     * @param article 文章基本信息
     * @param base 文章基础信息
     * @param content 文章内容
     */
    add(article: Omit<ArticleIndex, 'id' | 'createTime' | 'updateTime'>, base: ArticleBase, content: string): Promise<number>;

    /**
     * 更新索引信息
     * @param id
     * @param article
     */
    updateIndex(id: number, article: Partial<ArticleIndex>): Promise<void>;

}
