import {useFeedbackGet} from "@/nested/feedback/apis/common";
import Constant from "@/global/Constant";
import {UserView} from "@/nested/feedback/apis/types";

/**
 * PluginView
 */
export interface PluginView {
  /**
   * 插件封面
   */
  cover?: string;
  /**
   * 插件描述
   */
  description?: string;
  id?: string;
  /**
   * 插件名称
   */
  name?: string;
  /**
   * 是否已归档
   */
  isArchiving?: boolean;
}

/**
 * UpdateLogInfoView
 */
export interface UpdateLogInfoView {
  /**
   * 内容
   */
  content?: string;
  /**
   * 弹窗提醒
   */
  dialog?: boolean;
  id?: string;
  /**
   * 喜欢数量
   */
  likeCount?: number;
  /**
   * 发布日期
   */
  publishDate?: string;
  /**
   * 回复数量
   */
  replyCount?: number;
  /**
   * 用户列表
   */
  users?: UserView[];
  /**
   * 版本
   */
  version?: string;
  /**
   * 浏览数量
   */
  viewCount?: number;

  /**
   * 创建者
   */
  create?: UserView;

  /**
   * 创建时间
   */
  createTime?: string;
}

/**
 * PluginStatisticsView
 */
export interface PluginStatisticsView extends PluginView{
  feedbackCount?: number;
  likeCount?: number;
  replyCount?: number;
  hasManage?: boolean;
  /**
   * 故事数量
   */
  storyCount?: number;
  /**
   * 更新日志数量
   */
  updateLogCount?: number;
  /**
   * 常见问题数量
   */
  faqCount?: number;

  /**
   * 团队博客数量
   */
  blogCount?: number;
  /**
   * 更新日志
   */
  logs?: UpdateLogInfoView[];
}

/**
 * PluginFieldView
 */
export interface PluginFieldView {
  /**
   * 字段
   */
  field?: string;
  id: string;
  /**
   * 是否是必要的
   */
  required?: boolean;
}


export function pluginAll() {
  return useFeedbackGet<Array<PluginView>>(`${Constant.feedback_base}/api/plugin/all/v1`)
}

export function pluginInfo() {
  return useFeedbackGet<PluginStatisticsView>(`${Constant.feedback_base}/api/plugin/info/${Constant.feedback_id}/v1`)
}

export function pluginField() {
  return useFeedbackGet<Array<PluginFieldView>>(`${Constant.feedback_base}/api/plugin/field/${Constant.feedback_id}/v1`)
}