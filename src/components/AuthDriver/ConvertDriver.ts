import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";

/**
 * 转换驱动
 */
export interface ConvertDriver {

    /**
     * 将docx转为markdown
     * @param folder 文件所在目录
     * @param file docx文件
     * @param title 文章标题
     */
    docxToMarkdown(folder: number, file: ArrayBuffer, title?: string): Promise<void>;

    /**
     * 将docx转为富文本
     * @param folder 文件所在目录
     * @param file docx文件
     * @param title 文章标题
     */
    docxToRichText(folder: number, file: ArrayBuffer, title?: string): Promise<void>;

    /**
     * 导入html为markdown
     * @param folder 文件所在目录
     * @param html 文件
     * @param title 文章标题
     */
    htmlToMarkdown(folder: number, html: string, title?: string): Promise<void>;

    /**
     * 导入内容为文章
     * @param folder 文件所在目录
     * @param content 文件内容
     * @param type 文章内容
     * @param title 文章标题
     */
    textToArticle(folder: number, content: string, type: ArticleTypeEnum, title?: string): Promise<void>;

    /**
     * 导入zip为文章
     * @param folder 文件所在目录
     * @param file 文件
     */
    zipToArticle(folder: number, file: Blob): Promise<void>;

    /**
     * 将文章转为md文件导出
     * @param folder 文件所在目录
     */
    articleToZip(folder: number): Promise<void>;

}
