import {UserView} from "@/nested/feedback/apis/types";
import {useFeedbackGet} from "@/nested/feedback/apis/common";
import Constant from "@/global/Constant";

/**
 * FeedbackView
 */
export interface FeedbackView {
  /**
   * 内容，Markdown，让前端去渲染
   */
  content?: string;
  /**
   * 创建人
   */
  create?: UserView;
  /**
   * 创建时间
   */
  createTime?: string;
  id?: string;
  /**
   * 是否关闭
   */
  isClose?: boolean;
  /**
   * 是否是好问题
   */
  isGood?: boolean;
  /**
   * 是否隐藏
   */
  isHidden?: boolean;
  /**
   * 是否是已喜欢
   */
  isLiked?: boolean;
  /**
   * 是否置顶
   */
  isTop?: boolean;
  /**
   * 喜欢数量
   */
  likeCount?: number;
  /**
   * 回复
   */
  replies?: ReplyView[];
  /**
   * 回复数量
   */
  replyCount?: number;
}


/**
 * ReplyView
 */
export interface ReplyView {
  /**
   * 内容，Markdown，让前端去渲染
   */
  content?: string;
  /**
   * 创建人
   */
  create?: UserView;
  /**
   * 创建时间
   */
  createTime?: string;
  id?: string;
  /**
   * 是否是已喜欢
   */
  isLiked?: boolean;
  /**
   * 喜欢人数
   */
  likeCount?: number;
  /**
   * 父级回复ID
   */
  parentId?: string;
  /**
   * 回复的用户
   */
  replyTo?: UserView;
}

export function feedbackInfo(id: string) {
  return useFeedbackGet<FeedbackView>(`${Constant.feedback_base}/api/feedback/${Constant.feedback_id}/info/${id}/v1`)
}