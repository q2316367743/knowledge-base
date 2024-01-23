import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {base64toBlob, blobToBase64} from "@/utils/BrowserUtil";
import {RedirectPreload} from "@/plugin/utools";
import {getAttachmentBySync, postAttachment} from "@/utils/utools/DbStorageUtil";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import {useGlobalStore} from "@/store/GlobalStore";
import Constant from "@/global/Constant";
import PlatformTypeEnum from "@/enumeration/PlatformTypeEnum";
import {isUtools} from "@/global/BeanFactory";

/**
 * 文件上传组件
 * @param data 图片数据
 * @return 链接
 */
export async function useImageUpload(data: File | string): Promise<string> {

    useGlobalStore().startLoading("开始上传图片");

    try {
        let url = await selfImageUpload(data);
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

function selfImageUpload(data: File | Blob | string): Promise<string> {

    if (useBaseSettingStore().baseSetting.imageStrategy === ImageStrategyEnum.INNER) {

        if (Constant.platform === PlatformTypeEnum.WEB) {
            return Promise.reject("web版不支持上传图片到内部");
        }

        if (typeof data === 'string') {
            data = base64toBlob(data.replace("data:image/png;base64,", ""));
        }
        return useUtoolsImageUpload(data);
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

/**
 * 图片上传使用插件
 * @param data 图片数据
 */
export async function useImageUploadByPlugin(data: File | Blob | string): Promise<void> {

    if (Constant.platform === PlatformTypeEnum.WEB || !isUtools) {
        return Promise.reject("web版不支持调用图床");
    }

    if (typeof data !== 'string') {
        data = await blobToBase64(data);
    }
    // 使用图床插件
    utools.redirect(['图床', '上传到图床'], {
        type: 'img',
        data: data
    } as RedirectPreload);
    return Promise.resolve();
}


async function useUtoolsImageUpload(data: Blob | File): Promise<string> {
    const id = new Date().getTime() + '';

    const url = await postAttachment(
        LocalNameEnum.ARTICLE_ATTACHMENT + id,
        data
    );
    return Promise.resolve(url);
}

/**
 * 根据图片ID，获取图片连接（同步）
 * @param id 附件ID
 * @return 图片地址
 */
export function useLoadImageBySync(id: string): string {
    return getAttachmentBySync(id);
}

