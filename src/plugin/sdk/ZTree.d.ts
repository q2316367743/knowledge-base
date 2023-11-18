export interface TreeNode {
    key: string;
    name: string;
    isLeaf: boolean;
    children?: Array<TreeNode>;
}


export interface ZTreeInstance {

    /**
     * 增加节点
     * @param parent 指定的父节点，如果增加根节点，请设置 parentNode 为 null 即可。
     * @param index 新节点插入的位置（从 0 开始）；index = -1 时，插入到最后
     * @param nodes 需要增加的节点数据 JSON 对象集合
     * @param isSilent 设定增加节点后是否自动展开父节点。
     * @return 返回值是 zTree 最终添加的节点数据集合
     */
    addNodes(parent: TreeNode | null, index: number, nodes: Array<TreeNode>, isSilent: boolean): Array<TreeNode>;

    /**
     * 清空某父节点的子节点。
     *
     * 1、清空子节点后，父节点会自动变为叶子节点，如需要父节点保持父节点状态，请设置 setting.data.keep.parent 属性。
     * 2、请勿用此方法清空根节点，如果需要清空根节点，直接初始化 zTree，并且设置初始节点为 null 即可。
     * 3、此方法不会触发任何事件回调函数。
     * 请通过 zTree 对象执行此方法。
     *
     *  @param parentNode 需要清空子节点的父节点数据
     */
    removeChildNodes(parentNode: TreeNode): Array<TreeNode>;

    /**
     * 删除节点
     * @param treeNode 要删除的阶段数据
     * @param callbackFlag true：触发回调，false：不触发回调
     */
    removeNode(treeNode: TreeNode, callbackFlag: boolean);

}

export interface ZTreeSetting {

    edit?: ZTreeSettingEdit;

    callback?: ZTreeSettingCallback
}

interface ZTreeSettingEdit {
    enable?: boolean;
    editNameSelectAll?: boolean;
    showRemoveBtn?: boolean | showBtnFunc;
    showRenameBtn?: boolean | showBtnFunc;
    removeTitle?: string;
    renameTitle?: string;
}

type showBtnFunc = (treeId: string, treeNode: TreeNode) => boolean;

interface ZTreeSettingCallback{

    /**
     * 展开前回调
     * @param treeId 树的ID
     * @param treeNode 被展开的树的节点
     * @return 是否展开
     */
    beforeExpand?: (treeId: string, treeNode: TreeNode) => boolean;

    /**
     * 点击前回调
     * @param treeId 树的ID
     * @param treeNode 被点击的树的节点
     * @param clickFlag 节点被点击后的选中操作类型
     */
    beforeClick?: (treeId: string, treeNode: TreeNode, clickFlag: number) => boolean

    /**
     * 移除前回调
     * @param treeId 树的ID
     * @param treeNode 被点击的树的节点
     * @param clickFlag 节点被点击后的选中操作类型
     */
    beforeRemove?: (treeId: string, treeNode: TreeNode) => boolean

    /**
     * 点击事件
     * @param event 事件
     * @param treeId 树的ID
     * @param treeNode 被点击的树的节点
     * @param clickFlag 节点被点击后的选中操作类型
     */
    onClick?: (event: Event, treeId: string, treeNode: TreeNode, clickFlag: number) => void;

    /**
     * 删除
     * @param event 事件
     * @param treeId 树的ID
     * @param treeNode 被点击的树的节点
     */
    onRemove?: (event: Event, treeId: string, treeNode: TreeNode) => void;

    /**
     * 重命名
     * @param event 事件
     * @param treeId 树的ID
     * @param treeNode 被点击的树的节点
     * @param isCancel 是否取消操作。isCancel = true 表示取消编辑操作（按下 ESC 或 使用 cancelEditName 方法）。isCancel = false 表示确认修改操作
     */
    onRename?: (event: Event, treeId: string, treeNode: TreeNode, isCancel: boolean) => void;

}
