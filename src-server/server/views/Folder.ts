import type { ListTree } from "@/utils/TreeUtil";

/**
 * 目录
 */
export interface Folder extends ListTree {
  /**
   * 创建时间
   */
  createTime: Date | string;

  /**
   * 更新时间
   */
  updateTime: Date | string;

  /**
   * 文字颜色，默认跟随系统
   */
  fontColor?: string;

  /**
   * 文字颜色是否扩散到目录下文章
   */
  diffusion?: boolean;
}
