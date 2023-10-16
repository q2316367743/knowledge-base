enum LocalNameEnum {

    AUTH = '/local/auth/',

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

    ARTICLE_ATTACHMENT = '/article/attachment/',

    SETTING_BASE = '/local/setting/base',

    SETTING_BACKUP = '/local/setting/backup',

    ZONE = '/local/zone',

    ZONE_BASE = '/zone/base/',

    ZONE_CONTENT = '/zone/content/',

    ZONE_PREVIEW = '/zone/preview/',

    ZONE_ATTACHMENT = '/zone/attachment/',

    ZONE_COMMENT = '/zone/comment/',

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
     * 上一次的文章ID
     */
    KEY_HOME_EDITOR_ID = '/key/home/editor/id',

}

export default LocalNameEnum;
