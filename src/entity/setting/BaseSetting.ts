import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import ArticleThemeEnum from "@/enumeration/ArticleThemeEnum";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";

export default interface BaseSetting {

    /**
     * 文章主题
     */
    articleTheme: ArticleThemeEnum;

    /**
     * 图片策略
     */
    imageStrategy: ImageStrategyEnum;

    /**
     * 当屏幕太小时，是否自动收起
     */
    autoCollapsedByEditor: boolean;

    /**
     * 当屏幕太小时，是否自动收起
     */
    autoCollapsedByTodo: boolean;

    /**
     * 新建文章的文件名模板
     */
    newArticleTemplateByName: string;

    /**
     * 代码拓展名
     */
    codeExtraName: string;

    /**
     * markdown编辑器编辑模式
     */
    mdEditorEditMode: MdEditorEditModeEnum;

}
