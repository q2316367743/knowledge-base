import EditorDriverTypeEnum from "@/enumeration/EditorDriverTypeEnum";

/**
 * 编辑器驱动
 */
export interface EditorDriver {

    id: number;

    createTime: Date | string;

    updateTime: Date | string;

    /**
     * 编辑器驱动类型
     */
    type: EditorDriverTypeEnum

    /**
     * 路径
     */
    path: string;

}

