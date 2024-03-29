import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";
import {pathJoin} from "@/utils/file/FileUtil";
import Constant from "@/global/Constant";

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
     * 待办文章动作
     */
    todoArticleAction: ArticleActionEnum;

    /**
     * 关联文章动作
     */
    relationArticleAction: ArticleActionEnum;

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
        newArticleAutoName: true,
        newArticleTemplateByName: "[新建文章] (YYYY/MM/DD HH:mm)",
        codeExtraName: 'ts',
        mdEditorEditMode: MdEditorEditModeEnum.AUTO,
        todoArticleAction: ArticleActionEnum.DRAWER,
        relationArticleAction: ArticleActionEnum.TO_ARTICLE
    }
}
