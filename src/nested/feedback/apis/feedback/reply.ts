import {useFeedbackPost} from "@/nested/feedback/apis/common";
import Constant from "@/global/Constant";

/**
 * 参数
 *
 * ReplyPostParam
 */
export interface ReplyPostParam {
  /**
   * 回复内容
   */
  content?: string;
  /**
   * 回复ID，回复反馈可以不存在
   */
  replyId?: string;

}

export function feedbackReply(feedbackId: string, data: ReplyPostParam) {
  return useFeedbackPost<void>(`${Constant.feedback_base}/feedback/${Constant.feedback_id}/reply/${feedbackId}/v1`, data)
}