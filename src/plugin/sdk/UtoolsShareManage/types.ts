export interface Result<T> {

    code: number;

    msg: string;

    data: T;

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
