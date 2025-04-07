import {useFeedbackPost} from "@/nested/feedback/apis/common";
import Constant from "@/global/Constant";

/**
 * 反馈信息
 *
 * FeedbackPostParam
 */
export interface FeedbackPostParam {
  /**
   * 内容，Markdown，让前端去渲染
   */
  content?: string;
  /**
   * 字段
   */
  fields?: Record<string, string>;
  /**
   * 类型
   */
  type?: number;
}


export function feedbackPost(param: FeedbackPostParam) {
  return useFeedbackPost<void>(`${Constant.feedback_base}/api/feedback/${Constant.feedback_id}/post/v1`, param);
}