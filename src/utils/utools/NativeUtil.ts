import MessageUtil from "@/utils/modal/MessageUtil";

/**
 * 获取屏幕截图
 */
export function getScreenShot() {
  return new Promise<string>(resolve => {
    utools.screenCapture(resolve);
  })
}
export function copyText(text: string) {
  utools.copyText(text);
  MessageUtil.success("已成功复制到剪切板")
}