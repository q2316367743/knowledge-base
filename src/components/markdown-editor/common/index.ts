import {useFileSystemAccess} from "@vueuse/core";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import MessageUtil from "@/utils/MessageUtil";

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
 * 文件上擦混，返回文件hash
 * @param blob 文件内容
 */
export async function useImageUpload(data: Blob | ArrayBuffer): Promise<string> {
    const id = new Date().getTime() + '';

    let buffer: ArrayBuffer;

    if (data instanceof Blob) {
        buffer = await data.arrayBuffer();
    } else {
        buffer = data
    }


    const res = await utools.db.promises.postAttachment(
        LocalNameEnum.ARTICLE_ATTACHMENT + id,
        new Uint8Array(buffer),
        'image'
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
        MessageUtil.warning(`资源【${id}】加载失败`)
        return ""
    }
    const blob = new Blob([data]);
    return window.URL.createObjectURL(blob);
}

/**
 * 根据图片ID，获取图片连接（异步）
 * @param id 附件ID
 */
export async function loadImageByAsync(id: string): Promise<string> {
    const data = await utools.db.promises.getAttachment(LocalNameEnum.ARTICLE_ATTACHMENT + id);
    if (!data) {
        return Promise.reject(`资源【${id}】加载失败`)
    }
    const blob = new Blob([data]);
    return Promise.resolve(window.URL.createObjectURL(blob));
}
