import Constant from "@/global/Constant";
import {utools} from '@/plugin/utools';
import {useGlobalStore} from "@/store/GlobalStore";

export type EventIdentificationEnum = 'update' | 'page_jump' |
    'feature' | 'recommend' | 'new_article' | 'keymap' | 'ai';

let user = utools.getUser();
let nickname = '';
if (user) {
    nickname = user.nickname;
}

const profileId = utools.getNativeId();

export function login() {
    if (utools.isDev()) {
        return;
    }
    window.TDAPP.login({
        profileId: profileId,
        profileType: 1,
        name: nickname
    })
}

export function register() {
    if (utools.isDev()) {
        return;
    }
    window.TDAPP.register({
        profileId: profileId,
        profileType: 1,
        name: nickname
    })
}

/**
 * 访问某个标签
 * @param event 操作
 * @param additional 附加
 */
export function access(event: EventIdentificationEnum, additional?: string) {
    track(event, additional ? {
        additional: additional
    } : undefined);

}

/**
 * 时间埋点
 * @param event 操作
 * @param params 附加参数
 */
export function track(event: EventIdentificationEnum, params?: Record<string, string>) {
    if (utools.isDev()) {
        return;
    }
    if (useGlobalStore().privacy !== 1) {
        // 没有同意隐私协议
        return Promise.resolve();
    }
    let system;
    if (utools.isWindows()) {
        system = "Windows";
    } else if (utools.isMacOS()) {
        system = "MacOS"
    } else if (utools.isLinux()) {
        system = "Linux"
    } else {
        system = navigator.userAgent;
    }
    const data: Record<string, any> = {
        ...(params || {}),
        // 操作系统
        system,
        // 当前用户
        nickname: nickname,
        // 使用的版本
        version: Constant.version
    };
    try {
        window.TDAPP.onEvent(event, "", data);
    } catch (e) {
        console.error("埋点统计失败", e);
    }
    try {
        window.umami.track(event, data);
    } catch (e) {
        console.error("埋点统计失败", e);
    }
}




