import {TreeNodeData} from "@arco-design/web-vue";

/**
 * 文章驱动
 */
export interface ArticleService {

    /**
     * 加载目录
     * @param key 目录关键字
     * @return 目录
     */
    loadToc(key: string): Promise<Array<TreeNodeData>>;

    /**
     * 获取文章内容
     * @param key 文章key
     * @return 文章内容
     */
    getArticle(key: string): Promise<string>;

    /**
     * 保存文章
     * @param key 文章key
     * @param content 文章内容
     */
    saveArticle(key: string, content: string): Promise<void>;

}
