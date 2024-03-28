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

    // ========================== 设置 ==========================

    SETTING_BASE = '/local/setting/base',

    SETTING_BACKUP = '/local/setting/backup',

    SETTING_THEME = '/local/setting/theme',

    SETTING_LSKY_PRO = '/local/setting/lsky-pro',

    SETTING_WORKSPACE = '/local/setting/workspace',

    SETTING_CHAT = '/local/setting/chat',

    SETTING_IMAGE = '/local/setting/image',

    /**
     * 待办清单中待办项索引，内部保存了全部的待办项
     */
    TODO_CATEGORY = '/todo/category/',

    /**
     * 待办分组关联文章，这个待办清单所关联的全部文章ID
     */
    TODO_ARTICLE = '/todo/article/',

    /**
     * 待办项的详细内容
     */
    TODO_ITEM = '/todo/item/',

    /**
     * 待办项的属性
     */
    TODO_ATTR = '/todo/attr/',

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
     * 首页排序
     */
    KEY_HOME_SORT = '/key/home/sort',

    /**
     * 上一次的文章ID
     */
    KEY_HOME_EDITOR_ID = '/key/home/editor/id',

    /**
     * 展开的目录
     */
    KEY_HOME_EXPANDED_KEYS = '/key/home/expanded/keys',

    /**
     * 应用主题
     */
    KEY_APP_THEME = '/key/app/theme',

    /**
     * 待办导出脚本
     */
    KEY_TODO_SCRIPT = '/key/todo/script',

    /**
     * 聊天模型
     */
    KEY_CHAT_MODELS = '/key/chat/models',

    /**
     * 文章——AI警告
     */
    KEY_ARTICLE_AI_FILE_WARN = '/key/article/ai/warning'

}

export default LocalNameEnum;
