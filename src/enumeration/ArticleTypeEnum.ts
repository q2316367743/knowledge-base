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

}

// 文本类型
export const TEXT_TYPE_LIST = [
  ArticleTypeEnum.MARKDOWN,
  ArticleTypeEnum.CODE,
  ArticleTypeEnum.RICH_TEXT,
  ArticleTypeEnum.MIND_MAP,
  ArticleTypeEnum.SUPER_EDITOR,
]