export interface WorkspaceSetting {

    /**
     * 自定义markdown编辑器
     */
    customerMarkdown: boolean;

    /**
     * markdown编辑器类型
     */
    markdownEditOnly: boolean;

}

export function getDefaultWorkspaceSetting(): WorkspaceSetting {
    return {
        customerMarkdown: true,
        markdownEditOnly: false
    }
}
