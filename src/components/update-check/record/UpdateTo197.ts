import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {ImageSetting} from "@/entity/setting/ImageSetting";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

export async function updateTo197FromUnder() {
    const res = await getFromOneByAsync<any>(LocalNameEnum.SETTING_BASE);
    let record = res.record;
    if (record) {
        await saveOneByAsync<ImageSetting>(LocalNameEnum.SETTING_IMAGE, {
            localImagePath: record.localImagePath,
            imageStrategy: record.imageStrategy
        })
    }

}
