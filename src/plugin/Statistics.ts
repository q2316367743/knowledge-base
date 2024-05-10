import Constant from "@/global/Constant";
import {generateUUID} from "@/utils/BrowserUtil";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import axios from "axios";
import {utools} from '@/plugin/utools';
import {trackEvent} from "@/plugin/sdk/statistics";

export type EventIdentificationEnum = 'update' | 'page_jump' |
    'feature' | 'recommend' | 'new_article' | 'keymap' | 'ai';

let user = utools.getUser();
let nickname = '';
if (user) {
    nickname = user.nickname;
}

let token = getItemByDefault<string>(LocalNameEnum.KEY_TOKEN, "");
if (!token) {
    token = generateUUID();
    setItem(LocalNameEnum.KEY_TOKEN, token);
}
const profileId = token;
let expired = 0;


export async function getTokenThrow() {
    const now = new Date();
    if (token === '' || now.getTime() > expired) {
        const res = await utools.fetchUserServerTemporaryToken();
        token = res.token;
        expired = res.expiredAt + now.getTime();
    }
    return token;
}

function getToken() {
    return getTokenThrow()
        .catch(e => {
            const now = new Date();
            console.error(e);
            token = generateUUID();
            expired = 7200 + now.getTime();
        })
}


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
        _access(event, additional)
            .then(() => console.log('自定义统计成功'))
            .catch(e => console.error("自定义统计失败", e));
        trackEvent(event, additional)
    } catch (e) {
        console.error("自定义埋点统计失败", e);
    }
}


/**
 * 自己的统计事件
 *
 * @param operate 操作
 * @param additional 附加
 */
async function _access(operate: string, additional?: string) {
    let system: string;
    if (utools.isWindows()) {
        system = "Windows";
    } else if (utools.isMacOS()) {
        system = "MacOS"
    } else if (utools.isLinux()) {
        system = "Linux"
    } else {
        system = navigator.userAgent;
    }
    await axios({
        url: Constant.statistics,
        method: "POST",
        params: {
            id: Constant.uid
        },
        data: {
            token: await getToken(),
            nickname: nickname,
            operate,
            additional,
            system,
            version: Constant.version
        },
    });

}


