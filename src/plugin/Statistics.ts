import Constant from "@/global/Constant";
import {utools} from '@/plugin/utools';
import {trackEvent} from "@/plugin/sdk/statistics";

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
    try {
        window.TDAPP.onEvent(event, "", {
            ...(params || {}),
            // 操作系统
            system,
            // 当前用户
            nickname: nickname,
            // 使用的版本
            version: Constant.version
        });
    } catch (e) {
        console.error("埋点统计失败", e);
    }
    try {
        const additional = params ? (params['additional'] ? params['additional'] : JSON.stringify(params)) : '';
        trackEvent(event, additional)
    } catch (e) {
        console.error("自定义埋点统计失败", e);
    }
}




