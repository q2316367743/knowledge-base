import { useFeedbackPage} from "@/nested/feedback/apis/common";
import Constant from "@/global/Constant";
import {FeedbackPageRequest} from "@/nested/feedback/apis/types";

/**
 * FeedbackListView
 */
export interface FeedbackListView {
  /**
   * 内容，Markdown，让前端去渲染
   */
  content?: string;
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
   * 是否置顶
   */
  isTop?: boolean;
  /**
   * 喜欢数量
   */
  likeCount?: number;
  /**
   * 插件ID
   */
  pluginId?: string;
  /**
   * 插件名称
   */
  pluginName?: string;
  /**
   * 回复数量
   */
  replyCount?: number;
}



export function userFeedback(params: FeedbackPageRequest) {
  return useFeedbackPage<FeedbackListView>(`${Constant.feedback_base}/api/user/feedback/v1`, {
    ...params,
    pluginId: Constant.feedback_id
  });
}