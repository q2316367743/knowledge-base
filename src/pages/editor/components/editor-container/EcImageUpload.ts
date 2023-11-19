import {useGlobalStore} from "@/store/GlobalStore";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import Constant from "@/global/Constant";
import PlatformTypeEnum from "@/enumeration/PlatformTypeEnum";
import {base64toBlob} from "@/utils/BrowserUtil";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import {getAttachmentBySync} from "@/utils/utools/DbStorageUtil";
import {useEditorDriverStore} from "@/store/db/EditorDriverStore";
import {useImageUploadByPlugin} from "@/plugin/image";

/**
 * 文件上传组件
 * @param path 文件路径
 * @param data 图片数据
 * @return 链接
 */
export async function useEcImageUpload(path: string, data: File | string): Promise<string> {

    useGlobalStore().startLoading("开始上传图片");

    try {
        let url = await selfImageUpload(path, data);
        if (Constant.platform === PlatformTypeEnum.TAURI) {
            url = getAttachmentBySync(url);
        }
        return Promise.resolve(url);
    } catch (e) {
        return Promise.reject(e)
    } finally {
        useGlobalStore().closeLoading();
    }

}

async function selfImageUpload(path: string, data: File | Blob | string): Promise<string> {
    if (useBaseSettingStore().baseSetting.imageStrategy === ImageStrategyEnum.INNER) {
        if (typeof data === 'string') {
            data = base64toBlob(data.replace("data:image/png;base64,", ""));
        }
        return useEditorDriverStore().service.upload(path, data);
    } else if (useBaseSettingStore().baseSetting.imageStrategy === ImageStrategyEnum.IMAGE) {
        return useImageUploadByPlugin(data).then(() => (""));
    } else if (useBaseSettingStore().baseSetting.imageStrategy === ImageStrategyEnum.LSKY_PRO) {
        if (typeof data === 'string') {
            data = base64toBlob(data.replace("data:image/png;base64,", ""));
        }
        return useLskyProSettingStore().upload(data)
    }
    return Promise.reject("请在基础设置中选择图片上传策略")

}
