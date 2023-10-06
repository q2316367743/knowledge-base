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
     */
    put(doc: DbDoc): Promise<DbReturn>;

    /**
     * 获取文档
     */
    get(id: string): Promise<DbDoc | null>;

    /**
     * 删除文档
     */
    remove(doc: string | DbDoc): Promise<DbReturn>;

    /**
     * 获取所有文档 可根据文档id前缀查找
     */
    allDocs(key?: string): Promise<DbDoc[]>;

    /**
     * 存储附件到新文档
     * @param docId 文档ID
     * @param attachment 附件 buffer
     */
    postAttachment(docId: string, attachment: Blob): Promise<DbReturn>;

    /**
     * 获取附件
     * @param docId 文档ID
     * @return 文件链接
     */
    getAttachment(docId: string): Promise<string>;

}
