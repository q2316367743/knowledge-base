export interface AttachmentDriver {

    /**
     * 存储附件到新文档
     * @param docId 文档ID
     * @param attachment 附件 buffer
     * @return 链接
     */
    postAttachment(docId: string, attachment: Blob | File): Promise<string>;

    /**
     * 获取附件
     * @param docId 文档ID
     * @return 文件链接
     */
    getAttachment(docId: string): Promise<string>;

    /**
     * 获取附件
     * @param docId 文档ID
     * @return 文件链接
     */
    getAttachmentBy(docId: string): string;

}
