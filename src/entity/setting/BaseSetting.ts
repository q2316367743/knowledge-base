import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";

export interface BaseSetting {

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
     * 新建文章时是否自动命名
     */
    newArticleAutoName: boolean;

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

    /**
     * markdown编辑器快捷键风格，目前仅支持 sublime 和 vim
     */
    mdEditorKeyMap: 'sublime' | 'vim';

    /**
     * 待办文章动作
     */
    todoArticleAction: ArticleActionEnum;

    /**
     * 关联文章动作
     */
    relationArticleAction: ArticleActionEnum;

    /**
     * 表格列数
     */
    tableColumnCount: number;

    /**
     * 表格行数
     */
    tableColCount: number;

    /**
     * 经典换行
     */
    classicBr: boolean;

}

export enum ArticleActionEnum {
    // 前往文章
    TO_ARTICLE = 1,
    // 侧边预览
    DRAWER = 2
}

export function getDefaultBaseSetting(): BaseSetting {
    return {
        imageStrategy: ImageStrategyEnum.INNER,
        autoCollapsedByEditor: true,
        autoCollapsedByTodo: true,
        newArticleAutoName: false,
        newArticleTemplateByName: "[新建文章] (YYYY/MM/DD HH:mm)",
        codeExtraName: 'ts',
        mdEditorEditMode: MdEditorEditModeEnum.AUTO,
        todoArticleAction: ArticleActionEnum.DRAWER,
        relationArticleAction: ArticleActionEnum.TO_ARTICLE,
        tableColumnCount: 26,
        tableColCount: 26,
        classicBr: true,
        mdEditorKeyMap: 'sublime'
    }
}
