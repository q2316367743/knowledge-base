import {HttpRequest} from "@/types/HttpRequest";
import HttpResponse from "@/types/HttpResponse";
import {AxiosInstance, AxiosRequestConfig} from "axios";


export default function http<T = string, D = any>(config: HttpRequest<D>): Promise<HttpResponse<T>> {
  const now = Date.now();
  return new Promise<HttpResponse<T>>((resolve, reject) => {
    const {
      baseURL = '',
      charset = 'utf-8',
      timeout = 30000,
      headers = {},
      data = '',
      url,
      responseType = 'arraybuffer',
      method = 'GET',
    } = config;
    const _config: AxiosRequestConfig = {
      baseURL,
      url,
      method,
      timeout,
      headers,
      data,
      responseType,
    };
    if (utools.isDev()) {
      console.log(_config);
    }
    const ax = window.preload.util.axios as AxiosInstance;
    ax(_config)
      .then(response => {
        if (responseType === 'blob') {
          // 如果是图片，不需要解码
          // @ts-ignore
          resolve({...response, requestTime: Date.now() - now});
        } else if (responseType === 'arraybuffer') {
          response.data = window.preload.iconv.parseArrayBuffer(response.data, charset);
          resolve({...response, requestTime: Date.now() - now} as any);
        } else if (responseType === 'json') {
          resolve({...response, requestTime: Date.now() - now} as any);
        }
      }).catch(e => reject(e));
  });
};

export function getDataByText(url: string) {
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("get", url || '', true);
    xhr.responseType = "text";
    xhr.onload = () => {
      if (xhr.status == 200) {
        resolve(xhr.response);
      } else {
        reject(xhr.response);
      }
    };
    xhr.onerror = e => {
      reject(e)
    }
    xhr.send();
  })
}
