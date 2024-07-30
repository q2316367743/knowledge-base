export interface DbStorage {
    setItem<T = any>(key: string, value: T): void;

    getItem<T = any>(key: string): T;

    removeItem(key: string): void
}

export interface DbPromiseInstance {
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
     * 执行该方法将会批量更新数据库文档，传入需要更改的文档对象合并成数组进行批量更新。
     */
    bulkDocs(docs: DbDoc[]): Promise<DbReturn[]>;

    /**
     * 获取所有文档 可根据文档id前缀查找
     */
    allDocs(key?: string): Promise<DbDoc[]>;

    /**
     * 存储附件到新文档
     * @param docId 文档ID
     * @param attachment 附件 buffer
     * @param type 附件类型，示例：image/png, text/plain
     */
    postAttachment(docId: string, attachment: Uint8Array, type: string): Promise<DbReturn>;

    /**
     * 获取附件
     * @param docId 文档ID
     */
    getAttachment(docId: string): Promise<Uint8Array | null>;

    /**
     * 获取附件类型
     * @param docId 文档ID
     */
    getAttachmentType(docId: string): Promise<string | null>;

    /**
     * 云端复制数据状态 (null: 未开启数据同步、0: 已完成复制、1：复制中)
     */
    replicateStateFromCloud(): Promise<null | 0 | 1>;
}
