import HttpProgressEvent from "./HttpProgressEvent";

export interface HttpRequestCore {

    /**
     * 请求方式，默认GET
     */
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';

    /**
     * JSON字符串、json对象
     */
    headers: string | Record<string, string>;

    /**
     *
     */
    cookie: string;

    /**
     * 超时时间，默认15000ms
     */
    timeout: number;

    /**
     * 编码，默认UTF-8
     */
    charset: string;

    /**
     * 使用uBrowser进行请求
     */
    webview: boolean;

    /**
     * webview等待时间，默认10000ms
     */
    wait: string;

    /**
     * 非GET请求的请求体
     */
    data?: any;

}

export function buildDefaultHttpRequest(): HttpRequestCore {
    return {
        method: 'GET',
        headers: '',
        cookie: '',
        timeout: 15000,
        charset: '',
        webview: false,
        wait: '',
    }
}

export const requestMethodOptions = [{
    label: 'GET',
    value: 'GET'
}, {
    label: 'POST',
    value: 'POST'
}, {
    label: 'PUT',
    value: 'PUT'
}, {
    label: 'DELETE',
    value: 'DELETE'
}];

export interface HttpRequest<D = any> {

    baseURL?: string;

    url: string;

    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';

    timeout?: number;

    responseType?: 'json' | 'arraybuffer' | 'blob';

    data?: D;

    headers?: Record<string, string>;

    /**
     * 编码
     */
    charset?: string;

    /**
     * 使用uBrowser进行请求
     */
    webview?: boolean;

    /**
     * 下载进度
     * @param progressEvent 进度回调
     */
    onDownloadProgress?: (progressEvent: HttpProgressEvent) => void;

    /**
     * webview等待时间，默认10000ms
     */
    wait?: string;
}
