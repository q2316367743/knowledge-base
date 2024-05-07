export interface Result<T> {

    code: number;

    msg: string;

    data: T;

}

export interface PluginCategory {

    id: number;

    name: string;

}


/**
 * Pagination«PluginCategoryScriptList»
 */
export interface Pagination<T> {
    count?: number;
    page?: number;
    records?: T[];
    size?: number;
    total?: number;
}


/**
 * PluginCategoryScriptList
 */
export interface PluginCategoryScriptList {
    /**
     * 分类ID
     */
    categoryId?: number;
    /**
     * 分类名字
     */
    categoryName?: string;
    /**
     * 创建人
     */
    createName?: string;
    /**
     * 脚本描述
     */
    description?: string;
    /**
     * 下载数量
     */
    downloadCount?: number;
    id?: number;
    /**
     * 喜欢数量
     */
    likeCount?: number;
    /**
     * 脚本名字
     */
    name?: string;
    /**
     * 审核状态
     */
    verityStatus?: number;
    /**
     * 审核时间
     */
    verityTime?: string;

    /**
     * 最后申请ID
     */
    lastApplicationId?: number;
}

/**
 * 脚本实例
 *
 * PluginScriptInstance
 */
export interface PluginScriptInstance {
    /**
     * 访问token
     */
    accessToken?: string;
    /**
     * 脚本内容
     */
    content?: string;
    /**
     * 脚本描述
     */
    description?: string;
    /**
     * 如果没有则为第一次
     */
    id?: number;
    /**
     * 脚本名字
     */
    name?: string;
}

/**
 * PluginScriptApplicationView
 */
export interface PluginScriptApplicationView {
    /**
     * 申请ID，起到了一个版本的作用
     */
    applicationId?: number;
    /**
     * 脚本ID
     */
    id?: number;
}

/**
 * PluginScriptContentView
 */
export interface PluginScriptContentView {
    /**
     * 申请ID，起到了一个版本的作用
     */
    applicationId?: number;

    /**
     * 脚本名称
     */
    name?: string;
    /**
     * 内容
     */
    content?: string;
    /**
     * 脚本ID
     */
    id?: number;

    /**
     * 分类ID
     */
    categoryId?: number;
}

export const verityStatusEnum: Record<number, string> = {
    0: "待审核",
    1: "审核通过",
    2: "审核驳回",
    3: "审核取消"
}
