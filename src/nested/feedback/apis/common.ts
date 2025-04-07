import {AxiosInstance, AxiosRequestConfig} from "axios";
import {useFeedbackStore} from "@/nested/feedback/store";
import {FeedbackPageRequest, FeedbackPageResult, FeedbackResult} from "@/nested/feedback/apis/types";
import MessageUtil from "@/utils/modal/MessageUtil";

export async function useFeedbackRequest<T>(config: AxiosRequestConfig): Promise<T> {
  config.headers = {
    ...config.headers,
    'Content-Type': 'application/json;charset=UTF-8'
  }
  const ax = window.preload.util.axios as AxiosInstance;
  try {
    const rsp = await ax.request<FeedbackResult<T>>({
      ...config,
      headers: {
        ...config.headers,
        'Token': useFeedbackStore().token
      }
    });

    if (rsp.data.code === 200) {
      return rsp.data.data!;
    } else {
      console.error(rsp);
      throw new Error(rsp.data.message);
    }
  } catch (e) {
    MessageUtil.error("请求失败", e);
    throw e;
  }
}

export function useFeedbackGet<T>(url: string, params?: Record<string, any>) {
  return useFeedbackRequest<T>({
    url,
    method: 'GET',
    params
  });
}


export function useFeedbackPost<T>(url: string, data?: Record<string, any> | FormData) {
  return useFeedbackRequest<T>({
    url,
    method: 'POST',
    data
  });
}

export async function useFeedbackPage<T, P extends Record<string, any>>(url: string, params: FeedbackPageRequest & P) {
  return useFeedbackGet<FeedbackPageResult<T>>(url)
}