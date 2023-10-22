import {useAuthStore} from "@/store/components/AuthStore";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import ImageStrategyEnum from "@/enumeration/ImageStrategyEnum";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {blobToBase64} from "@/utils/BrowserUtil";
import {RedirectPreload} from "@/plugin/utools";

/**
 * 文件上传组件
 * @param data 图片数据
 * @return 链接
 */
export async function useImageUpload(data: Blob): Promise<string> {

    if (useBaseSettingStore().baseSetting.imageStrategy === ImageStrategyEnum.INNER) {
        return useUtoolsImageUpload(data);
    }else if (useBaseSettingStore().baseSetting.imageStrategy === ImageStrategyEnum.IMAGE) {
        // 使用图床插件
        blobToBase64(data).then(base64 => {
            // 使用图床
            utools.redirect(['图床', '上传到图床'], {
                type: 'img',
                data: base64
            } as RedirectPreload);
        })
        return Promise.resolve("");
    }

    return Promise.reject("请在基础设置中选择图片上传策略")

}

async function useUtoolsImageUpload(data: Blob): Promise<string> {
    const id = new Date().getTime() + '';

    const url = await useAuthStore().authDriver.postAttachment(
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
    const data = utools.db.getAttachment(LocalNameEnum.ARTICLE_ATTACHMENT + id);
    if (!data) {
        console.error(`资源【${id}】加载失败`)
        return 'file:////'+window.preload.pathJoin(useAuthStore().auth.path, '/article/attachment/' + id + '.png')
    }
    const blob = new Blob([data]);
    return window.URL.createObjectURL(blob);
}

/**
 * 根据图片ID，获取图片连接（异步）
 * @param id 附件ID
 * @return 图片地址
 */
export async function useLoadImageByAsync(id: string): Promise<string> {
    const data = await useAuthStore().authDriver.getAttachment(LocalNameEnum.ARTICLE_ATTACHMENT + id);
    return Promise.resolve(data);
}
