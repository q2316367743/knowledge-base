import {writeText} from "@tauri-apps/api/clipboard";
import {isPermissionGranted, requestPermission, sendNotification} from "@tauri-apps/api/notification";

async function _showNotification(body: string) {
    let permissionGranted = await isPermissionGranted();
    if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === 'granted';
    }
    if (permissionGranted) {
        sendNotification(body);
    }
}

export const tauri = {
    shellOpenExternal(url: string): void {
        open(url);
    },
    copyText(content: string) {
        writeText(content).then(() => console.log("复制到剪切板"));
    },
    /**
     * 显示系统通知
     */
    showNotification(body: string): void {
        _showNotification(body).then(() => console.log("显示通知"));
    }
}
