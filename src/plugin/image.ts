import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {base64toBlob, blobToBase64} from "@/utils/BrowserUtil";
import {RedirectPreload} from "@/plugin/utools";
import {getAttachmentByAsync, getAttachmentBySync, postAttachment} from "@/utils/utools/DbStorageUtil";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";

/**
 * 文件上传组件
 * @param data 图片数据
 * @return 链接
 */
export async function useImageUpload(data: Blob | string): Promise<string> {

    if (useBaseSettingStore().baseSetting.imageStrategy === ImageStrategyEnum.INNER) {
        if (typeof data === 'string') {
            data = base64toBlob(data.replace("data:image/png;base64,", ""));
        }
        return useUtoolsImageUpload(data);
    } else if (useBaseSettingStore().baseSetting.imageStrategy === ImageStrategyEnum.IMAGE) {
        if (typeof data !== 'string') {
            data = await blobToBase64(data);
        }
        // 使用图床插件
        utools.redirect(['图床', '上传到图床'], {
            type: 'img',
            data: data
        } as RedirectPreload);
        return Promise.resolve("");
    }else  if (useBaseSettingStore().baseSetting.imageStrategy === ImageStrategyEnum.LSKY_PRO) {
        if (typeof data === 'string') {
            data = base64toBlob(data.replace("data:image/png;base64,", ""));
        }
        return useLskyProSettingStore().upload(data)
    }

    return Promise.reject("请在基础设置中选择图片上传策略")

}

async function useUtoolsImageUpload(data: Blob): Promise<string> {
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

/**
 * 根据图片ID，获取图片连接（异步）
 * @param id 附件ID
 * @return 图片地址
 */
export async function useLoadImageByAsync(id: string): Promise<string> {
    const data = await getAttachmentByAsync(id);
    return Promise.resolve(data);
}
