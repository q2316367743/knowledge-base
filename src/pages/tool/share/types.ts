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
