import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";

/**
 * 转换驱动
 */
export interface ConvertDriver {

    /**
     * 将docx转为markdown
     * @param file docx文件
     * @param title 文章标题
     */
    docxToMarkdown(file: ArrayBuffer, title?: string): Promise<void>;

    /**
     * 将docx转为富文本
     * @param file docx文件
     * @param title 文章标题
     */
    docxToRichText(file: ArrayBuffer, title?: string): Promise<void>;

    /**
     * 导入html为markdown
     * @param html 文件
     * @param title 文章标题
     */
    htmlToMarkdown(html: string, title?: string): Promise<void>;

    /**
     * 导入内容为文章
     * @param content 文件内容
     * @param type 文章内容
     * @param title 文章标题
     */
    textToArticle(content: string, type: ArticleTypeEnum, title?: string): Promise<void>;

    /**
     * 导入zip为文章
     * @param file 文件
     */
    zipToArticle(file: Blob): Promise<void>;

    /**
     * 将文章转为md文件导出
     */
    articleToZip(): Promise<void>;

}
