import MessageUtil from "@/utils/modal/MessageUtil";

const port = utools.isDev() ? 11010 : 11000;

export function renderAttachmentBaseUrl() {
    return `http://localhost:${port}/attachment}`;
}

export function createServer() {
    window.preload.customer.createServer(port,() => {
        console.log(`图片服务启动成功，端口号：${port}`);
    }, error => {
        MessageUtil.error("图片服务启动失败，请检查11000端口是否被占用，这将导致富文本、思维导图图片展示失败。", error);
    });
}

export function renderAttachmentUrl(key: string) {
    return `${renderAttachmentBaseUrl()}?key=${encodeURIComponent(key)}`;
}
