import MessageUtil from "@/utils/modal/MessageUtil";
import {getAttachmentBySync} from "@/utils/utools/DbStorageUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {NativeUtil} from "@/utils/utools/NativeUtil";

const port = import.meta.env.DEV ? 11010 : 11000;
let run = true;

// TODO: 此处有BUG
export function renderAttachmentBaseUrl() {
  return `http://localhost:${port}/attachment`;
}

export function createServer() {
  NativeUtil.customer.createServer(port, () => {
    console.log(`图片服务启动成功，端口号：${port}`);
  }, error => {
    MessageUtil.error(`图片服务启动失败，请检查${port}端口是否被占用，这将导致富文本、思维导图图片展示失败。`, error);
    run = false;
  });
}

export function renderAttachmentUrlByUTools(key: string) {
  if (run) {
    return `${renderAttachmentBaseUrl()}?key=${encodeURIComponent(key)}`;
  }
  return getAttachmentBySync(key);
}

export const fetchUrl = `http://localhost:${port}/fetchUrl`

export function renderHttpImage(key: string) {
  return `http://localhost:${port}/image?url=${encodeURIComponent(key)}`;
}