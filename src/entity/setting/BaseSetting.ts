import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";

export default interface BaseSetting {

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

    /**
     * 代码是否换行
     */
    codeWrap: boolean;

    /**
     * 图片策略
     */
    imageStrategy: ImageStrategyEnum;

}
