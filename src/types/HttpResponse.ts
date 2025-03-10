import {HttpRequest} from "./HttpRequest";

export default interface HttpResponse<T = string, D = any> {

    /**
     * 响应数据
     */
    data: T;

    status: number;

    statusText: string;

    /**
     * 响应头
     */
    headers: Record<string, any>;

    /**
     * 请求内容
     */
    config: HttpRequest<D>;

    /**
     * 请求耗时
     */
    requestTime: number;

}
