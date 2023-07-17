import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";

export default interface Setting {

    /**
     * 代码白天主题
     */
    codeLightTheme: string;

    /**
     * 代码黑夜主题
     */
    codeDarkTheme: string;

    /**
     * 文章主题
     */
    articleTheme: ArticleThemeEnum;

    /**
     * 文章头部是否显示
     */
    articleHeaderVisible: boolean;

}
