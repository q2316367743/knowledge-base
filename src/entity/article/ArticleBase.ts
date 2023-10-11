import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";

export interface ArticleBaseSetting {

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
}

/**
 * 文章基础信息
 */
export interface ArticleBase extends ArticleBaseSetting{

    /**
     * 是否自动以
     */
    customer: boolean;

    /**
     * 源链接
     */
    sourceUrl: string;

}

export function getDefaultArticleBase(source?: Partial<ArticleBase>): ArticleBase {
    return Object.assign({
        sourceUrl: '',
        customer: false,
        codeLightTheme: 'github',
        codeDarkTheme: 'github-dark',
        articleTheme: ArticleThemeEnum.TAILWIND_BLUE,
        articleHeaderVisible: true,
        codeWrap: false,
    }, source);
}

export function getDefaultArticleBaseByBaseSetting(): ArticleBase {
    const baseSetting = useBaseSettingStore().baseSetting;
    return {
        sourceUrl: '',
        customer: false,
        ...baseSetting
    };
}
