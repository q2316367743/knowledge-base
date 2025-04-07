import Constant from "@/global/Constant";
import {useFeedbackGet, useFeedbackPost} from "@/nested/feedback/apis/common";

/**
 * UserLoginView
 */
export interface UserLoginView {
  /**
   * 头像
   */
  avatar?: string;
  /**
   * 创建时间
   */
  createTime?: string;
  id?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 用户角色
   */
  role?: number;
  /**
   * token
   */
  token?: string;
}


/**
 * UserUToolsView
 */
export interface UserUToolsView {
  /**
   * 账号信息
   */
  account?: UToolsAccount;
  /**
   * 是否存在账号
   */
  existAccount?: boolean;
}

/**
 * 账号信息
 *
 * UToolsAccount
 */
export interface UToolsAccount {
  /**
   * 头像
   */
  avatar?: string;
  /**
   * 是否是uTools会员（0：否，1是）
   */
  member?: number;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * uTools用户ID，对于此插件应用
   */
  openId?: string;
  /**
   * 属于哪个插件ID
   */
  pluginId?: string;
  /**
   * 时间戳
   */
  timestamp?: number;
}

export function authInfo() {
  return useFeedbackGet<UserLoginView>(`${Constant.feedback_base}/api/auth/info/v1`);
}

export async function authUTools() {
  return useFeedbackPost<UserUToolsView>(`${Constant.feedback_base}/api/auth/uTools/v1`, {
    pluginId: Constant.feedback_id,
    accessToken: (await utools.fetchUserServerTemporaryToken()).token
  })
}

export async function authLogin(res: UserUToolsView) {
  return useFeedbackPost<UserLoginView>(`${Constant.feedback_base}/api/auth/login/v1`, {
    authMethod: 2,
    authKey: res.account?.openId!,
    authValue: Constant.feedback_id
  })
}