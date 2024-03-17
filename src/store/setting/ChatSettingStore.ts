import {ChatSetting, getDefaultChatSetting} from "@/entity/setting/ChatSetting";
import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {computed, ref} from "vue";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";

export const useChatSettingStore = defineStore(LocalNameEnum.SETTING_CHAT, () => {
    const chatSetting = ref(getDefaultChatSetting());
    let rev: undefined | string = undefined;

    const enable = computed(() => chatSetting.value.enable);

    async function init() {
        const res = await getFromOneByAsync<ChatSetting>(LocalNameEnum.SETTING_CHAT);
        if (res.record) {
            chatSetting.value = res.record;
            rev = res.rev;
        }
    }

    async function save(res: ChatSetting) {
        chatSetting.value = res;
        rev = await saveOneByAsync(LocalNameEnum.SETTING_CHAT, chatSetting.value, rev);
    }

    return {
        chatSetting, enable, init, save
    }


})
