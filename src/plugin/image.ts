import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {base64toBlob, blobToBase64} from "@/utils/BrowserUtil";
import {RedirectPreload} from "@/plugin/utools";
import {getAttachmentBySync, postAttachment} from "@/utils/utools/DbStorageUtil";
import {useLskyProSettingStore} from "@/store/setting/LskyProSettingStore";
import {useGlobalStore} from "@/store/GlobalStore";
import {isUtools} from "@/global/BeanFactory";

const BASE64_PREFIX: string = 'data:image/png;base64,';

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

    const {imageStrategy} = useBaseSettingStore();

    if (imageStrategy === ImageStrategyEnum.INNER) {

        if (isUtools) {
            if (isLocal) {
                // utools的富文本转为base64
                return useImageUploadByBase64(data);
            }else {
                return useImageUploadByUtools(data);
            }
        } else {
            // web版直接使用base64
            return useImageUploadByBase64(data);
        }

    } else if (imageStrategy === ImageStrategyEnum.IMAGE) {
        await useImageUploadByPlugin(data);
        return ("");
    } else if (imageStrategy === ImageStrategyEnum.LSKY_PRO) {
        return useImageUploadByLskyPro(data)
    }
    return Promise.reject("请在基础设置中选择图片上传策略")

}

// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------- 上传图片 ---------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

async function useImageUploadByBase64(data: File | Blob | string): Promise<string> {
    if (data instanceof Blob) {
        data = await blobToBase64(data);
    }
    return data;
}

/**
 * 图片上传使用插件
 * @param data 图片数据
 */
async function useImageUploadByPlugin(data: File | Blob | string): Promise<void> {

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


async function useImageUploadByUtools(data: Blob | File | string): Promise<string> {
    if (typeof data === 'string') {
        data = base64toBlob(data.replace(BASE64_PREFIX, ""));
    }
    const id = new Date().getTime() + '';
    return postAttachment(
        LocalNameEnum.ARTICLE_ATTACHMENT + id,
        data
    );

}

async function useImageUploadByLskyPro(data: Blob | File | string): Promise<string> {
    if (typeof data === 'string') {
        data = base64toBlob(data.replace(BASE64_PREFIX, ""));
    }
    return useLskyProSettingStore().upload(data)
}

// --------------------------------------------------------------------------------------------------------------
// --------------------------------------------------- 加载图片 ---------------------------------------------------
// --------------------------------------------------------------------------------------------------------------

/**
 * 根据图片ID，获取图片连接（同步）
 * @param id 附件ID
 * @return 图片地址
 */
export function useLoadImageBySync(id: string): string {
    return getAttachmentBySync(id);
}

