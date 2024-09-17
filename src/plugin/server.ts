import {shallowRef} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";

const port = shallowRef(0);

export function createServer() {
    window.preload.createServer(res => {
        port.value = res;
    }, error => {
        MessageUtil.error("图片服务启动失败", error);
    });
}

export function renderAttachmentUrl(key: string) {
    return `http://localhost:${port.value}/attachment?key=${encodeURIComponent(key)}`;
}
