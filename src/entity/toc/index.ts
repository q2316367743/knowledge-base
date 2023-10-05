/**
 * 目录
 */
export interface Toc {

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
     * 名称，目录时有效
     */
    name: string;

    /**
     * 是否是文件夹
     */
    folder: string;

    /**
     * 子目录
     */
    children: Toc[];
}
