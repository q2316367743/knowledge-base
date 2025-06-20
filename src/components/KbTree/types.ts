export interface KbTreeNodeData {
  // 节点id
  value: string | number;
  // 节点标题
  label: string;
  // 是不是子节点
  leaf?: boolean;
  // 子节点
  children?: KbTreeNodeData[];

  [k: string]: any;
}
