import {
    PluginCategory,
    PluginCategoryScriptList, PluginScriptContentView, PluginScriptHistoryItem,
} from "@/plugin/sdk/UtoolsShareManage/types/PluginScript";
import {Pagination, Result} from "@/plugin/sdk/UtoolsShareManage/types";
import {instance} from "@/plugin/sdk/UtoolsShareManage/request";


export async function getPluginCategoryList(): Promise<Array<PluginCategory>> {
    const rsp = await instance.get<Result<Array<PluginCategory>>>(
        `/api/script/public/category/v1`)
    const data = rsp.data;
    if (data.code !== 200) {
        return Promise.reject(new Event(data.msg));
    }
    return rsp.data.data;
}

export async function page(categoryId: number): Promise<Pagination<PluginCategoryScriptList>> {
    const rsp = await instance.get<Result<Pagination<PluginCategoryScriptList>>>(
        `/api/script/public/page/${categoryId}/v1`)
    const data = rsp.data;
    if (data.code !== 200) {
        return Promise.reject(new Event(data.msg));
    }
    return data.data;
}

export async function download(id: number): Promise<PluginScriptContentView> {
    const rsp = await instance.get<Result<PluginScriptContentView>>(
        `/api/script/public/download/${id}/v1`)
    const data = rsp.data;
    if (data.code !== 200) {
        return Promise.reject(new Event(data.msg));
    }
    return rsp.data.data;
}


export async function history(id: number): Promise<Array<PluginScriptHistoryItem>> {
    const rsp = await instance.get<Result<Array<PluginScriptHistoryItem>>>(
        `/api/script/public/history/list/${id}/v1`);
    const data = rsp.data;
    if (data.code !== 200) {
        return Promise.reject(new Event(data.msg));
    }
    return data.data;
}

export async function downloadHistory(applicationId: number): Promise<PluginScriptContentView> {
    const rsp = await instance.get<Result<PluginScriptContentView>>(
        `/api/script/public/history/download/${applicationId}/v1`)
    const data = rsp.data;
    if (data.code !== 200) {
        return Promise.reject(new Event(data.msg));
    }
    return rsp.data.data;
}
