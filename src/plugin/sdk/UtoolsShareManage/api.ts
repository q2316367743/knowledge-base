import {
    Pagination,
    PluginCategory,
    PluginCategoryScriptList, PluginScriptApplicationView,
    PluginScriptInstance,
    Result
} from "@/plugin/sdk/UtoolsShareManage/types";
import axios from "axios";
import {utools} from "@/plugin/utools";
import Constant from "@/global/Constant";

const instance = axios.create({
    baseURL: utools.isDev() ? 'http://localhost:8080' : '',
    timeout: 5000
})

export async function getPluginCategoryList(): Promise<Array<PluginCategory>> {
    const rsp = await instance.get<Result<Array<PluginCategory>>>(`/public/plugin/category/${Constant.uid}/v1`)
    const data = rsp.data;
    if (data.code !== 200) {
        return Promise.reject(new Event(data.msg));
    }
    return rsp.data.data;
}

export async function page(categoryId: number): Promise<Pagination<PluginCategoryScriptList>> {
    const rsp = await instance.get<Result<Pagination<PluginCategoryScriptList>>>(
        `/public/plugin/page/${Constant.uid}/${categoryId}/v1`)
    const data = rsp.data;
    if (data.code !== 200) {
        return Promise.reject(new Event(data.msg));
    }
    return data.data;
}

export async function submit(categoryId: number, data: PluginScriptInstance) {
    const rsp = await instance.post<Result<PluginScriptApplicationView>>(`/public/plugin/submit/${Constant.uid}/${categoryId}/v1`, data);
    const res = rsp.data;
    if (res.code !== 200) {
        return Promise.reject(new Event(res.msg));
    }
    return res.data;
}
