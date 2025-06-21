import {KbTreeNodeData, KbTreeNodeValue} from "@/components/KbTree/types";

interface FindNodeResult {
  node: KbTreeNodeData;
  parent: Array<KbTreeNodeData>;
}

/**
 * 在树形数据中查找节点
 * @param  nodes - 树节点数组
 * @param  nodeId - 要查找的节点ID
 * @returns 找到的节点及其父节点
 */
export const findNode = (nodes: Array<KbTreeNodeData>, nodeId: KbTreeNodeValue): FindNodeResult | null => {
  for (const node of nodes) {
    if (node.value === nodeId) {
      return {node, parent: nodes};
    }

    if (node.children && node.children.length > 0) {
      const found = findNode(node.children, nodeId);
      if (found) {
        return found;
      }
    }
  }
  return null;
};

/**
 * 移动节点到目标文件夹
 * @param  treeData - 树形数据
 * @param  draggedNodeId - 被拖拽的节点ID
 * @param  targetFolderId - 目标文件夹ID
 * @returns  更新后的树形数据
 */
export const moveNode = (treeData: Array<KbTreeNodeData>, draggedNodeId: KbTreeNodeValue, targetFolderId: KbTreeNodeValue): Array<KbTreeNodeData> => {
  // 查找被拖拽的节点及其父节点
  const draggedNodeInfo = findNode(treeData, draggedNodeId);
  if (!draggedNodeInfo) return treeData;

  const {node: draggedNode, parent: draggedParent} = draggedNodeInfo;

  // 查找目标文件夹节点
  const targetFolderInfo = findNode(treeData, targetFolderId);
  if (!targetFolderInfo || !targetFolderInfo.node) return treeData;

  const targetFolder = targetFolderInfo.node;

  // 确保目标节点是文件夹（非叶子节点）
  if (targetFolder.leaf) return treeData;

  // 从原位置移除节点
  const draggedIndex = draggedParent.findIndex(n => n.id === draggedNodeId);
  if (draggedIndex !== -1) {
    draggedParent.splice(draggedIndex, 1);
  }

  // 添加到目标文件夹
  if (!targetFolder.children) {
    targetFolder.children = [];
  }
  targetFolder.children.push(draggedNode);

  return [...treeData];
};