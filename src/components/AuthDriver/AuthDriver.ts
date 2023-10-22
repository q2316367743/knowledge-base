import {DbDoc, DbReturn} from "@/plugin/utools";

/**
 * 认证驱动类
 * @since 1.1.0
 */
export interface AuthDriver {

    /**
     * 初始化
     */
    init(): Promise<void>;

    /**
     * 创建/更新文档
     * @param doc 文档
     */
    put(doc: DbDoc): Promise<DbReturn>;

    /**
     * 获取文档
     */
    get(id: string): Promise<DbDoc | null>;

    /**
     * 删除文档
     * @param doc 文档
     */
    remove(doc: string | DbDoc): Promise<DbReturn>;

    /**
     * 获取所有文档 可根据文档id前缀查找
     * @param key 前缀
     */
    allDocs(key?: string): Promise<Array<DbDoc>>;

    /**
     * 获取全部的key
     * @param key key的前缀
     */
    allDocKeys(key?: string): Promise<Array<string>>;

    /**
     * 存储附件到新文档
     * @param docId 文档ID
     * @param attachment 附件 buffer
     * @return 链接
     */
    postAttachment(docId: string, attachment: Blob): Promise<string>;

    /**
     * 获取附件
     * @param docId 文档ID
     * @return 文件链接
     */
    getAttachment(docId: string): Promise<string>;

}
