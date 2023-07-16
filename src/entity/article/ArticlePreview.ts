export interface ArticlePreview {

    /**
     * 渲染后的HTML
     */
    html: string;

    toc: Array<ArticlePreviewToc>

}

export interface ArticlePreviewToc {

    /**
     * 目录名字
     */
    name: string;

    /**
     * 子目录
     */
    children: Array<ArticlePreviewToc>;

}
