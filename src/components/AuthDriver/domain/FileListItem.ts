export interface FileListItem {

    /**
     * 名字
     */
    name: string;

    /**
     * 是否是文件夹
     */
    folder: boolean;

    /**
     * 路径
     */
    path: string;

}

export interface PathIndex {

    key: string;

    value: string;

}
