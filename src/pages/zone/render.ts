import {VNode} from "vue";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useAuthStore} from "@/store/components/AuthStore";


/**
 * 渲染图片
 * @param e 事件
 * @param id 图片ID
 * @returns 图片base64形式
 */
export function renderImage(e: VNode, id: string) {
    renderLazyByArcoImage(e, LocalNameEnum.ZONE_ATTACHMENT + id);
}

export function transformUint8ArrayToBase64(array: Uint8Array): string {
    let binary = "";
    for (let len = array.byteLength, i = 0; i < len; i++) {
        binary += String.fromCharCode(array[i]);
    }
    return window.btoa(binary).replace(/=/g, "");
}


export function renderLazyByArcoImage(e: VNode, _id: string, callback?: () => void) {
    let el = e.el as HTMLDivElement;
    let img = el.querySelector('img');
    useAuthStore().authDriver.getAttachment(_id)
        .then(url => {
            if (url) {
                if (img) {
                    img.src = url;
                    if (callback) {
                        callback();
                    }
                }
            }
        });
}
