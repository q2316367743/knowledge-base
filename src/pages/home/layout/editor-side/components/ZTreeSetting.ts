import {TreeNode, ZTreeInstance, ZTreeSetting} from "@/plugin/sdk/ZTree";
import {Ref} from "vue";
import {useFolderStore} from "@/store/db/FolderStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import MessageUtil from "@/utils/MessageUtil";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";

export function getTreeNodes(parentId: number): Array<TreeNode> {
    // 先搜索文件夹
    const folders = useFolderStore().folderGroupMap.get(parentId);
    // 再搜索文章
    const articles = useArticleStore().folderMap.get(parentId);
    return [...(folders || []).map(e => ({
        key: e.id + '',
        name: e.name,
        isLeaf: false,
        children: []
    })), ...(articles || []).map(e => ({
        key: e.id + '',
        name: e.name,
        isLeaf: true,
    }))]
}

export function buildZTreeSetting(zTreeObj: Ref<ZTreeInstance | null>): ZTreeSetting {
    return {
        edit: {
            enable: true,
            editNameSelectAll: true,
            showRenameBtn: true,
            removeTitle: "删除",
            renameTitle: "重命名",
            drag: {
                isCopy: false,
                isMove: true,
                prev: false,
                inner: true,
                next: true
            }
        },
        data: {
            keep: {
                parent: true
            }
        },
        callback: {
            beforeExpand(treeId: string, treeNode: TreeNode): boolean {
                console.log(treeNode)
                // 不存在
                if (!treeNode.isLeaf) {
                    // 文件夹
                    const nodes = getTreeNodes(parseInt(treeNode.key));
                    console.log(nodes)
                    if (zTreeObj.value) {
                        zTreeObj.value.addNodes(treeNode, 0, nodes, false);
                    }
                }
                return true;
            },
            beforeClick(treeId, treeNode, clickFlag) {
                if (clickFlag === 2) {
                    MessageUtil.warning("不支持多选");
                    return false;
                }
                return true;
            },
            onClick(e, treeId, treeNode, clickFlag) {
                const id = parseInt(treeNode.key);
                if (clickFlag === 1) {
                    if (useArticleStore().articleMap.has(id)) {
                        useHomeEditorStore().setId(id);
                    } else {
                        useHomeEditorStore().setId(0);
                    }
                }else if (clickFlag === 0) {
                    useHomeEditorStore().setId(0);
                }
            },
        }
    }
}
