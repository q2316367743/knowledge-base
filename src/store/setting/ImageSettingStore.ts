import {defineStore} from "pinia";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {ref} from "vue";
import {getDefaultImageSetting, ImageSetting} from "@/entity/setting/ImageSetting";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";

export const useImageSettingStore = defineStore(LocalNameEnum.SETTING_IMAGE, () => {
    const imageSetting = ref(getDefaultImageSetting());
    let rev: string | undefined = undefined;

    async function init() {
        const res = await getFromOneByAsync<ImageSetting>(LocalNameEnum.SETTING_IMAGE);
        if (res.record) {
            imageSetting.value = Object.assign(imageSetting.value, res.record);
            rev = res.rev;
        }
    }

    async function save(res: ImageSetting) {
        imageSetting.value = res;
        rev = await saveOneByAsync(LocalNameEnum.SETTING_IMAGE, imageSetting.value, rev);
    }

    return {imageSetting, init, save};

})
