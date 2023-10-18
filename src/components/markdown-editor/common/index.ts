import {useFileSystemAccess} from "@vueuse/core";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useAuthStore} from "@/store/components/AuthStore";

/**
 * 选择文件，返回文件内容
 */
export function useFileSelect(): Promise<Blob | null> {
    const file = useFileSystemAccess({
        dataType: 'Blob',
        types: [{
            description: "图片",
            accept: {
                "image/png": ['.png', '.jpg', '.jpeg', '.webp', '.gif']
            }
        }]
    });
    const res = file.open() as Promise<void>;
    return new Promise<Blob | null>(resolve => {
        res.then(() => {
            if (file.file.value) {
                resolve(file.file.value)
            } else {
                resolve(null)
            }
        })
    })
}

/**
 * 文件上传，返回文件
 * @param data 文件内容
 */
export async function useImageUpload(data: Blob): Promise<string> {
    const id = new Date().getTime() + '';

    const res = await useAuthStore().authDriver.postAttachment(
        LocalNameEnum.ARTICLE_ATTACHMENT + id,
        data
    );
    if (res.error) {
        return Promise.reject(res.message);
    }
    return Promise.resolve(id);
}

/**
 * 根据图片ID，获取图片连接（同步）
 * @param id 附件ID
 */
export function loadImageBySync(id: string): string {
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
 */
export async function loadImageByAsync(id: string): Promise<string> {
    const data = await useAuthStore().authDriver.getAttachment(LocalNameEnum.ARTICLE_ATTACHMENT + id);
    return Promise.resolve(data);
}
