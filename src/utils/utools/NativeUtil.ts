/**
 * 获取屏幕截图
 */
export function getScreenShot() {
  return new Promise<string>(resolve => {
    utools.screenCapture(resolve);
  })
}