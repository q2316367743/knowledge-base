import {shallowRef} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";

const port = shallowRef(0);

export function createServer() {
    window.preload.customer.createServer(res => {
        port.value = res;
        console.log(`图片服务启动成功，端口号：${port.value}`);
    }, error => {
        MessageUtil.error("图片服务启动失败，请检查11000端口是否被占用，这将导致富文本、思维导图图片展示失败。", error);
    });
}

export function renderAttachmentUrl(key: string) {
    return `http://localhost:${port.value}/attachment?key=${encodeURIComponent(key)}`;
}
