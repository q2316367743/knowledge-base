import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {computed, ref} from "vue";
import {buildCardTodoSetting, CardTodoSetting} from "@/nested/todo/types/CardTodoSetting";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {clone} from "@/utils/lang/ObjUtil";

// TODO 此处应该为useUtoolsDbStorage
export const useSettingStore = defineStore(LocalNameEnum.CARD_TODO_SETTING, () => {
    const setting = ref(buildCardTodoSetting());
    let rev: string | undefined;

    const categoryId = computed(() => setting.value.categoryId);

    async function init() {
        let res = await getFromOneByAsync(LocalNameEnum.CARD_TODO_SETTING);
        if (res.record) {
            setting.value = Object.assign(setting.value, res.record);
        }
        rev = res.rev;
    }

    async function save(res: CardTodoSetting) {
        setting.value = res;
        rev = await saveOneByAsync(LocalNameEnum.CARD_TODO_SETTING, setting.value, rev);
    }

    function getSetting() {
        return clone(setting.value, true);
    }

    return {
        categoryId,
        init, save, getSetting
    }

})
