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
    count?: number | null;
    page?: number | null;
    records?: T[] | null;
    size?: number | null;
    total?: number | null;
}

/**
 * PluginCategoryScriptList
 */
export interface PluginCategoryScriptList {
    /**
     * 创建人
     */
    createName?: null | string;
    /**
     * 脚本描述
     */
    description?: string;
    id: number;
    /**
     * 脚本名字
     */
    name?: string;
    /**
     * 审核时间
     */
    verityTime?: null | string;
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
    accessToken?: null | string;
    /**
     * 脚本内容
     */
    content?: null | string;
    /**
     * 脚本描述
     */
    description?: null | string;
    /**
     * 如果没有则为第一次
     */
    id?: number | null;
    /**
     * 脚本名字
     */
    name?: null | string;
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
