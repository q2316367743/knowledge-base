enum LocalNameEnum {

  CATEGORY = '/local/category',

  FOLDER = '/local/folder',

  /**
   * 待办分类，此处保存了文件夹/清单
   */
  LOCAL_TODO_CATEGORY = '/local/todo-category',

  ARTICLE = '/local/article',

  ARTICLE_BASE = '/article/base/',

  ARTICLE_CONTENT = '/article/content/',

  ARTICLE_COMMENT = '/article/comment/',

  ARTICLE_AI = '/article/ai/',

  /**
   * 附件
   */
  ARTICLE_ATTACHMENT = '/article/attachment/',

  NEWS_LIST = '/list/news',

  NEWS_RULE = '/item/news/rule',

  // ========================== 设置 ==========================

  SETTING_BASE = '/local/setting/base',

  SETTING_BACKUP = '/local/setting/backup',

  SETTING_THEME = '/local/setting/theme',

  SETTING_LSKY_PRO = '/local/setting/lsky-pro',

  SETTING_WORKSPACE = '/local/setting/workspace',

  SETTING_CHAT = '/local/setting/chat',

  SETTING_IMAGE = '/local/setting/image',

  SETTING_PLUGIN = '/local/setting/plugin',

  SETTING_CODE_EDITOR = '/local/setting/code-editor',

  SETTING_CODE_RUN = '/local/setting/code-run',

  SETTING_CUSTOMER_FILE_NAME = '/local/setting/customer-file-name',


  LIST_PLUGIN_CONTENT = '/list/plugin/content',

  /**
   * 待办清单中待办项索引，内部保存了全部的待办项
   */
  TODO_CATEGORY = '/todo/category/',

  /**
   * 待办分组关联笔记，这个待办清单所关联的全部笔记ID
   */
  TODO_ARTICLE = '/todo/article/',

  /**
   * 待办清单中待办分组索引，内部保存了全部的待办分组
   */
  TODO_GROUP = '/todo/group/',

  /**
   * 待办项的详细内容
   */
  TODO_ITEM = '/todo/item/',

  /**
   * 待办项的属性
   */
  TODO_ATTR = '/todo/attr/',

  // ========================== ai相关 ==========================

  AI_SERVICE = '/ai/service',

  // uTools提供的模型缓存
  AI_U_TOOLS_MODELS = '/ai/uTools/models',

  AI_ASSISTANT = '/ai/assistant',

  LIST_AI_CHAT_ = '/list/ai/chat',

  ITEM_AI_CHAT_ = '/item/ai/chat',

  LIST_AI_GROUP = '/list/ai/group',

  ITEM_AI_GROUP_ = '/item/ai/group',

  // ========================== 键值存储 ==========================

  /**
   * 版本
   */
  VERSION = '/key/VERSION',

  /**
   * 临时编辑器内容
   */
  KEY_EDITOR_CONTENT = '/key/editor/content',

  /**
   * 首页宽度
   */
  KEY_HOME_WIDTH = '/key/home/width',

  /**
   * 笔记宽度
   */
  KEY_NOTE_WIDTH = '/key/note/width',

  /**
   * 首页排序
   */
  KEY_HOME_SORT = '/key/home/sort',

  /**
   * 上一次的笔记ID
   */
  KEY_HOME_EDITOR_ID = '/key/home/editor/id',

  /**
   * 打开的笔记ID
   */
  KEY_HOME_EDITOR_IDS = '/key/home/editor/ids',

  /**
   * 展开的目录
   */
  KEY_HOME_EXPANDED_KEYS = '/key/home/expanded/keys',

  /**
   * 应用主题
   */
  KEY_APP_THEME = '/key/app/theme',

  /**
   * 应用主题颜色
   */
  KEY_APP_COLOR = '/key/app/color',

  /**
   * 应用用户
   */
  KEY_APP_USER = '/key/app/user',

  /**
   * 应用收起
   */
  KEY_APP_COLLAPSED = '/key/app/collapsed',

  /**
   * 待办导出脚本
   */
  KEY_TODO_SCRIPT = '/key/todo/script',

  KEY_TODO_EXPANDED = '/key/todo/expanded',

  /**
   * 聊天模型
   */
  KEY_CHAT_MODELS = '/key/chat/models',

  /**
   * 笔记——AI警告
   */
  KEY_ARTICLE_AI_FILE_WARN = '/key/article/ai/warning',

  /**
   * AI提示
   */
  KEY_AI_PROMPT = '/key/ai/prompt',

  /**
   * 卡片 - 待办 - 设置
   */
  CARD_TODO_SETTING = '/card/todo/setting',

  KEY_TOKEN = '/key/token',

  // 首页服务
  KEY_HOME_SERVICE = '/key/home/service',

  // 首页助手
  KEY_HOME_ASSISTANT = '/key/home/assistant',

  // 首页模型
  KEY_HOME_MODEL = '/key/home/model',

  // 保存思考过程
  KEY_HOME_SAVE_THINK = '/key/home/save-think',

  // 编辑器使用的助手
  KEY_EDITOR_ASSISTANT = '/key/editor/assistant',

  // 小部件-聊天使用的助手
  KEY_WIDGET_CHAT_ASSISTANT = '/key/widget/chat/assistant',

  KEY_NEWS_CONTENT_SCALE = '/key/news/content/scale',

  // 组件-uTools模型更新
  KEY_COMPONENT_U_TOOLS_MODEL_UPDATE = '/key/component/uTools/model/update',

  // 组件-反馈-token
  KEY_COMPONENT_FEEDBACK_TOKEN = '/key/component/feedback/token',
  // 组件-反馈-用户信息
  KEY_COMPONENT_FEEDBACK_USER_INFO = '/key/component/feedback/user-info',

  KEY_SETTING_AI_ASSISTANT_SHOW_U_TOOLS = '/key/setting/ai-assistant/show/u-tools',

  // ========================== 窗口 ==========================

  WINDOW_CANVAS_FOLDER = '/window/canvas/folder',

  WINDOW_NOTE_FOLDER = '/window/note/folder',

  // ========================== 一次性变量 ==========================

  /**
   * 是否第一次使用流程图
   */
  FIRST_USE_LOGIC_FLOW = '/first/use/logic-flow',

  // 使用「图床」插件
  TIP_IMAGE_TO_IMAGE_PLUGIN = '/tip/image/to-image',

  TIP_ARTICLE_ADD = '/tip/article/add',

  // ========================== 一次性变量 ==========================

  // 首页欢迎的提示
  GUIDE_HOME_WELCOME = '/guide/home/welcome',

  // ========================== 功能模块 ==========================

  // 首页AI模块
  MODULE_AI = '/module/AI',

  // 新闻模块
  MODULE_NEWS = '/module/news',

  // ========================== 嵌入模块 ==========================

  // 嵌入/待办/专注时间
  NESTED_TODO_FOCUS_TIME = '/nested/todo/focus-time',

  // 嵌入/待办/提醒事项
  NESTED_TODO_REMINDER_ENABLE = '/nested/todo/reminder-enable',

  // 嵌入/待办/提醒事项
  NESTED_TODO_REMINDER_TEXT = '/nested/todo/reminder-text',

  // 嵌入/待办/提醒时间
  NESTED_TODO_REMINDER_TIME = '/nested/todo/reminder-time'
}

export default LocalNameEnum;
