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
    type: EditorDriverTypeEnum;

    /**
     * 驱动名字
     */
    name: string;

    /**
     * 路径
     */
    path: string;

}

export function getDefaultEditorDriver(): EditorDriver {
    const now = new Date();
    return {
        id: now.getTime(),
        createTime: now,
        updateTime: now,
        name: '',
        type: EditorDriverTypeEnum.LOCAL,
        path: ''
    }
}
