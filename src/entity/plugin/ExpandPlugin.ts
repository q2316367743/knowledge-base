/**
 * 拓展插件索引
 */
export interface ExpandPluginIndex {
  // 插件ID，全局唯一
  id: string;
  // 插件名称
  createTime: number;
  // 更新时间
  updateTime: number;
  // 插件名称
  name: string;
  // 插件版本
  version: string;
  // 插件描述
  description: string;
  // 作者
  author: string;
  // 作者主页
  homepage: string;
  // 分类
  category: string;
  // 最后的更新日志
  logs: Array<string>
}

/**
 * 拓展插件内容
 */
export interface ExpandPluginContent extends ExpandPluginIndex{
  content: string;
}