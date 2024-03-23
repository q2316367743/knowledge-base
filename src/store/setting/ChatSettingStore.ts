import {ChatSetting, getDefaultChatSetting} from "@/entity/setting/ChatSetting";
import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {computed, ref, shallowRef} from "vue";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import OpenAI from "openai";
import MessageUtil from "@/utils/modal/MessageUtil";
import {robot} from "@/store/components/HomeEditorStore";

export type MessageItem = MessageAssistant | MessageUser;
export interface MessageAssistant {
    role: 'assistant';
    content: string;
}

export interface MessageUser {
    role: 'user';
    content: string;
}


export const messages = ref(new Array<MessageItem>());
export const loading = ref(false);


export function sendMessage(content: string, resolve?: () => void) {
    robot.value = false;
    if (content.trim() === '') {
        return;
    }
    const {openAi, model} = useChatSettingStore();
    if (!openAi) {
        return;
    }
    messages.value.push({
        role: 'user',
        content: content.trim()
    });
    loading.value = true;

    openAi.chat.completions.create({
        model: model,
        messages: messages.value
    }).then(res => {
        const content = res.choices.sort((a, b) => a.index - b.index).map(e => e.message.content).join("/n");
        messages.value.push({
            role: 'assistant',
            content
        });
        resolve && resolve();
    }).catch(e => MessageUtil.error("聊天发生错误", e)).finally(() => loading.value = false);
}

export const useChatSettingStore = defineStore(LocalNameEnum.SETTING_CHAT, () => {
    const chatSetting = ref(getDefaultChatSetting());
    let rev: undefined | string = undefined;

    const openAi = shallowRef<OpenAI | null>(null);

    const enable = computed(() => chatSetting.value.enable);
    const model = computed(() => chatSetting.value.model);

    function buildOpenAi() {
        openAi.value = null;
        if (chatSetting.value.enable) {
            const api = chatSetting.value.api;
            openAi.value = new OpenAI({
                baseURL: api + (api.endsWith('/') ? '' : '/') + 'v1',
                apiKey: chatSetting.value.token,
                dangerouslyAllowBrowser: true
            })
        }
    }

    async function init() {
        const res = await getFromOneByAsync<ChatSetting>(LocalNameEnum.SETTING_CHAT);
        if (res.record) {
            chatSetting.value = res.record;
            rev = res.rev;
            buildOpenAi();
        }
    }

    async function save(res: ChatSetting) {
        chatSetting.value = res;
        rev = await saveOneByAsync(LocalNameEnum.SETTING_CHAT, chatSetting.value, rev);
        buildOpenAi();
    }

    return {
        chatSetting, openAi,
        enable, model,
        init, save
    }


})
