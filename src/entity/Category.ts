export default interface Category {

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
     * 分类名称
     */
    name: string;

    /**
     * 负极ID
     */
    pid: number;

}
