export type KbTreeNodeValue = string | number;

export interface KbTreeNodeData {
  // 节点id
  value: KbTreeNodeValue;
  // 是不是子节点
  leaf?: boolean;
  // 子节点
  children?: KbTreeNodeData[];
  // 图标
  icon?: any;
  // 节点标题
  label: string;
  // 节点内容
  text?: string;
  // 字体颜色
  color?: string;

  pid?: number;
  preview?: boolean;
  fontColor?: string;


  [k: string]: any;
}

export interface KbDropContext {
  draggedNodeId: KbTreeNodeValue;
  targetFolderId: KbTreeNodeValue;
  e: DragEvent;
}