export enum ArticleTypeEnum {

  /**
   * Markdown
   */
  MARKDOWN = 1,

  /**
   * 旧的EditorJS编辑器
   *
   * @deprecated
   */
  EDITOR_JS = 2,

  /**
   * 代码笔记
   */
  CODE = 3,

  /**
   * 富文本
   */
  RICH_TEXT = 4,

  /**
   * 表格
   * @deprecated 不再使用
   */
  EXCEL = 5,

  /**
   * 思维导图
   */
  MIND_MAP = 6,

  /**
   * drauu实现的画板
   * @deprecated 不再使用
   */
  DRAUU = 7,

  /**
   * 表格
   */
  HANDSONTABLE = 8,

  /**
   * logic flow 流程图
   */
  LOGIC_FLOW = 9,

  /**
   * 超级编辑器
   */
  SUPER_EDITOR = 10,

  /**
   * 加密编辑器
   */
  ENCRYPT_EDITOR = 11,

  /**
   * 闪卡
   */
  MEMO = 12,

  /**
   * AI聊天
   */
  AI_CHAT = 13

}

// 文本类型
export const TEXT_TYPE_LIST = [
  ArticleTypeEnum.MARKDOWN,
  ArticleTypeEnum.CODE,
  ArticleTypeEnum.RICH_TEXT,
  ArticleTypeEnum.MIND_MAP,
  ArticleTypeEnum.SUPER_EDITOR,
]

export interface ArticleIndex {

  id: number;

  /**
   * 创建时间
   */
  createTime: Date | string;

  /**
   * 更新时间
   */
  updateTime: Date | string;

  /**
   * 笔记名称
   */
  name: string;

  /**
   * 分类
   */
  categoryId?: number;

  /**
   * 所属文件夹
   */
  folder: number;

  /**
   * 是否是预览模式
   */
  preview: boolean;

  /**
   * 笔记类型
   *
   * @default ArticleTypeEnum.MARKDOWN
   */
  type: ArticleTypeEnum;

  /**
   * 是否是删除的
   */
  isDelete: boolean;

  /**
   * 文字颜色，默认跟随系统
   */
  fontColor?: string;

}

export function getDefaultArticleIndex(source?: Partial<ArticleIndex>): ArticleIndex {
  return Object.assign<ArticleIndex, Partial<ArticleIndex>>({
    id: 0,
    createTime: new Date(),
    updateTime: new Date(),
    name: '',
    folder: 0,
    preview: false,
    type: ArticleTypeEnum.MARKDOWN,
    isDelete: false
  }, source || {});
}
