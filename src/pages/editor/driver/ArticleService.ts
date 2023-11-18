import {TreeNode} from "@/plugin/sdk/ZTree";

/**
 * 文章驱动
 */
export interface ArticleService {

    /**
     * 加载目录
     * @param key 目录关键字
     * @return 目录
     */
    loadToc(key: string): Promise<Array<TreeNode>>;

    /**
     * 获取文章内容
     * @param key 文章key
     * @return 文章内容
     */
    getFile(key: string): Promise<string>;

    /**
     * 保存文章
     * @param key 文章key
     * @param content 文章内容
     */
    saveFile(key: string, content: string): Promise<void>;

    /**
     * 新建文件
     * @param path 文件路径
     * @param name 文件名
     */
    addFile(path: string, name: string): Promise<void>;

    /**
     * 删除文件
     * @param path 文件路径
     */
    removeFile(path: string): Promise<void>;

}
