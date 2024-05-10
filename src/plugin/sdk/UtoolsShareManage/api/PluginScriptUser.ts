import {Pagination, Result} from "@/plugin/sdk/UtoolsShareManage/types";
import {
    PluginCategoryScriptList,
    PluginScriptApplicationView, PluginScriptContentView, PluginScriptHistorySelfItem,
    PluginScriptInstance
} from "@/plugin/sdk/UtoolsShareManage/types/PluginScript";
import {instance} from "@/plugin/sdk/UtoolsShareManage/request";


export async function myself(categoryId: number, current: number, size: number): Promise<Pagination<PluginCategoryScriptList>> {
    const rsp = await instance.get<Result<Pagination<PluginCategoryScriptList>>>(
        `/open/script/user/myself/${categoryId}/v1`, {
            params: {
                current,size
            },
        })
    const data = rsp.data;
    if (data.code !== 200) {
        return Promise.reject(new Event(data.msg));
    }
    return data.data;
}

export async function submit(categoryId: number, data: PluginScriptInstance) {
    const rsp = await instance.post<Result<PluginScriptApplicationView>>(
        `/open/script/user/submit/${categoryId}/v1`, data);
    const res = rsp.data;
    if (res.code !== 200) {
        return Promise.reject(new Event(res.msg));
    }
    return res.data;
}

export async function history(id: number): Promise<Array<PluginScriptHistorySelfItem>> {
    const rsp = await instance.get<Result<Array<PluginScriptHistorySelfItem>>>(
        `/open/script/user/history/list/${id}/v1`);
    const data = rsp.data;
    if (data.code !== 200) {
        return Promise.reject(new Event(data.msg));
    }
    return data.data;
}


export async function downloadHistory(applicationId: number): Promise<PluginScriptContentView> {
    const rsp = await instance.get<Result<PluginScriptContentView>>(
        `/open/script/user/history/download/${applicationId}/v1`)
    const data = rsp.data;
    if (data.code !== 200) {
        return Promise.reject(new Event(data.msg));
    }
    return rsp.data.data;
}
