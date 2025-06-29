import {ChatSetting, getDefaultChatSetting} from "@/entity/setting/ChatSetting";
import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {computed, ref, shallowRef} from "vue";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import OpenAI from "openai";


export const useChatSettingStore = defineStore(LocalNameEnum.SETTING_CHAT, () => {
    const chatSetting = ref(getDefaultChatSetting());
    let rev: undefined | string = undefined;

    const openAi = shallowRef<OpenAI | null>(null);

    const enable = computed(() => chatSetting.value.enable);
    const model = computed(() => chatSetting.value.model);
    const api = computed(() => chatSetting.value.api);

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
        enable, model, api,
        init, save
    }


})
