import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {base64toBlob, blobToBase64} from "@/utils/BrowserUtil";
import {RedirectPreload} from "@/plugin/utools";
import {getAttachmentBySync, postAttachment} from "@/utils/utools/DbStorageUtil";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import {useGlobalStore} from "@/store/GlobalStore";
import {isUtools} from "@/global/BeanFactory";
import {useImageSettingStore} from "@/store/setting/ImageSettingStore";

/**
 * 文件上传组件
 * @param data 图片数据
 * @param isLocal 是否是本地，默认不是
 * @return 链接
 */
export async function useImageUpload(data: File | string, isLocal: boolean = false): Promise<string> {

    useGlobalStore().startLoading("开始上传图片");

    try {
        let url = await selfImageUpload(data, isLocal);
        return Promise.resolve(url);
    } catch (e) {
        return Promise.reject(e)
    } finally {
        useGlobalStore().closeLoading();
    }

}

async function selfImageUpload(data: File | Blob | string, isLocal: boolean): Promise<string> {

    const {imageStrategy} = useImageSettingStore().imageSetting;

    if (imageStrategy === ImageStrategyEnum.INNER) {

        if (!isUtools) {
            return Promise.reject("web版不支持上传图片到内部");
        }

        if (typeof data === 'string') {
            data = base64toBlob(data.replace("data:image/png;base64,", ""));
        }
        return useUtoolsImageUpload(data, isLocal);
    } else if (imageStrategy === ImageStrategyEnum.IMAGE) {
        await useImageUploadByPlugin(data);
        return ("");
    } else if (imageStrategy === ImageStrategyEnum.LSKY_PRO) {
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

    if (!isUtools) {
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


async function useUtoolsImageUpload(data: Blob | File, isLocal: boolean): Promise<string> {
    const id = new Date().getTime() + '';
    if (isLocal) {
        const {localImagePath} = useImageSettingStore().imageSetting;
        // @ts-ignore
        let path = await window.preload.writeToFile(localImagePath, id + '.png', data);
        const prefix = 'file://';
        if (utools.isWindows()) {
            return `${prefix}/${path}`;
        } else {
            return `${prefix}${path}`;
        }
    } else {
        return postAttachment(
            LocalNameEnum.ARTICLE_ATTACHMENT + id,
            data
        );
    }


}

/**
 * 根据图片ID，获取图片连接（同步）
 * @param id 附件ID
 * @return 图片地址
 */
export function useLoadImageBySync(id: string): string {
    return getAttachmentBySync(id);
}

