import {ListTree} from "@/entity/ListTree";

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

}
