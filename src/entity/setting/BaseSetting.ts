import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import MdEditorEditModeEnum from "@/enumeration/MdEditorEditModeEnum";

export interface BaseSetting {

  /**
   * 图片策略
   */
  imageStrategy: ImageStrategyEnum;

  /**
   * 图床-PicGo-端口
   */
  imagePicGoPort?: number;

  /**
   * 当屏幕太小时，是否自动收起
   */
  autoCollapsedByEditor: boolean;

  /**
   * 当屏幕太小时，是否自动收起
   */
  autoCollapsedByTodo: boolean;

  /**
   * 新建笔记时是否自动命名
   */
  newArticleAutoName: boolean;

  /**
   * 新建笔记的文件名模板
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
   * 待办笔记动作
   */
  todoArticleAction: ArticleActionEnum;

  /**
   * 关联笔记动作
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
  // 前往笔记
  TO_ARTICLE = 1,
  // 侧边预览
  DRAWER = 2,
  // 小窗预览
  WIDGET = 3,
}

export function getDefaultBaseSetting(): BaseSetting {
  return {
    imageStrategy: ImageStrategyEnum.INNER,
    autoCollapsedByEditor: false,
    autoCollapsedByTodo: true,
    newArticleAutoName: false,
    newArticleTemplateByName: "[新建笔记] (YYYY/MM/DD HH:mm)",
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
