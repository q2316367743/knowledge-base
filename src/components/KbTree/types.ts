export interface KbTreeNodeData {
  // 节点id
  value: string | number;
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
  fontColor?: string;

  [k: string]: any;
}
