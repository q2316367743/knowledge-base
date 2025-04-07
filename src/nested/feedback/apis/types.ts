/**
 * FeedbackResult
 */
export interface FeedbackResult<T> {
  code?: number;
  data?: T;
  message?: string;
}

/**
 * PageRspFeedbackListView
 */
export interface FeedbackPageResult<T> {
  data?: T[];
  pageNum?: number;
  pageSize?: number;
  total?: number;
}

export interface FeedbackPageRequest {
  pageNum?: number;
  pageSize?: number;
}

/**
 * 创建人
 *
 * UserView
 *
 * 回复的用户
 */
export interface UserView {
  /**
   * 头像
   */
  avatar?: string;
  id?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 用户角色
   */
  role?: number;
}