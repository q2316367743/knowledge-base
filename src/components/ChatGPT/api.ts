import {ListModel} from "@/components/ChatGPT/model/Model";
import axios, {AxiosRequestConfig} from "axios";
import {ChatResponse, Message} from "@/components/ChatGPT/model/Chat";
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";


function buildConfig(): AxiosRequestConfig {
    return {
        baseURL: useChatSettingStore().chatSetting.api,
        headers: {
            Authorization: 'Bearer ' + useChatSettingStore().chatSetting.token,
            'Content-Type': 'application/json',
            Accept: 'application/json'
        }

    }
}

/**
 * 列出全部的模型
 */
export async function listModels(): Promise<ListModel> {
    const res = await axios.get<ListModel>(
        '/models', buildConfig());
    return res.data;
}

/**
 * 进行聊天
 * @param messages 消息内容
 */
export async function completions(messages: Array<Message>): Promise<ChatResponse> {
    const model = useChatSettingStore().chatSetting.model;
    if (!model) {
        return Promise.reject(new Error("请先选择模型"));
    }
    const res = await axios.post<ChatResponse>('/chat/completions', {
        model: model,
        messages
    }, buildConfig());
    return res.data;
}
