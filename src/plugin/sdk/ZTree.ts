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
    removeNode(treeNode: TreeNode, callbackFlag: boolean): void;

    /**
     * 根据节点数据的属性进行搜索，获取条件完全匹配的节点数据对象
     * @param key 需要精确匹配的属性名称
     * @param value 需要紧缺匹配的属性值
     * @param parentNode 搜索范围，值定在某个父节点下的子节点进行搜索
     */
    getNodeByParam(key: string, value: any, parentNode: TreeNode | null): TreeNode | null;

}

export interface ZTreeSetting {

    edit?: ZTreeSettingEdit;

    callback?: ZTreeSettingCallback;

    data?: ZTreeSettingData;
}

interface ZTreeSettingData {
    keep?: ZTreeSettingDataKeep;
}

interface ZTreeSettingDataKeep {
    parent?: boolean;
    leaf?: boolean;
}

interface ZTreeSettingEdit {
    enable?: boolean;
    editNameSelectAll?: boolean;
    showRemoveBtn?: boolean | showBtnFunc;
    showRenameBtn?: boolean | showBtnFunc;
    removeTitle?: string;
    renameTitle?: string;
    drag?: ZTreeSettingEditDrag
}

interface ZTreeSettingEditDrag {
    isCopy?: boolean;
    isMove?: boolean;
    prev?: boolean;
    inner?: boolean;
    next?: boolean;
}

type showBtnFunc = (treeId: string, treeNode: TreeNode) => boolean;

interface ZTreeSettingCallback {

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
    beforeClick?: (treeId: string, treeNode: TreeNode, clickFlag: number) => boolean;

    /**
     * 用于捕获节点拖拽操作结束之前的事件回调函数，并且根据返回值确定是否允许此拖拽操作
     *
     * @param treeId 目标节点`targetNode`所在`zTree`的`treeId`，便于用户操控
     * @param treeNodes 被拖拽的节点 JSON 数据集合
     * @param treeNode treeNodes 被拖拽放开的目标节点 JSON 数据对象。
     * @param moveType 指定移动到目标节点的相对位置
     * @param isCopy 拖拽节点操作是 复制 或 移动
     */
    beforeDrop?: (treeId: string, treeNodes: Array<TreeNode>, treeNode: TreeNode, moveType: MoveType, isCopy: boolean) => void;

    /**
     * 移除前回调
     * @param treeId 树的ID
     * @param treeNode 被点击的树的节点
     * @param clickFlag 节点被点击后的选中操作类型
     */
    beforeRemove?: (treeId: string, treeNode: TreeNode) => boolean;

    /**
     * 点击事件
     * @param event 事件
     * @param treeId 树的ID
     * @param treeNode 被点击的树的节点
     * @param clickFlag 节点被点击后的选中操作类型
     */
    onClick?: (event: Event, treeId: string, treeNode: TreeNode, clickFlag: number) => void;

    /**
     * 用于捕获节点拖拽操作结束的事件回调函数
     * @param event
     * @param treeId 目标节点`targetNode`所在`zTree`的`treeId`，便于用户操控
     * @param treeNodes 被拖拽的节点 JSON 数据集合
     * @param targetNode treeNodes 被拖拽放开的目标节点 JSON 数据对象。
     * @param moveType 指定移动到目标节点的相对位置
     * @param isCopy 拖拽节点操作是 复制 或 移动
     */
    onDrop?:(event: Event, treeId: string, treeNodes: Array<TreeNode>, targetNode: TreeNode, moveType: MoveType, isCopy: boolean) => void;

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


type MoveType = 'inner' | 'prev' | 'next' | null;

export const getRoot = (): TreeNode => ({key: "", isLeaf: false, name: '', children: []});
