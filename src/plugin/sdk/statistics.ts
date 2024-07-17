import {utools} from "@/plugin/utools";
import Constant from "@/global/Constant";
import {isUtools} from "@/global/BeanFactory";
import {useGlobalStore} from "@/store/GlobalStore";

let token = '';
let expired = 0;

let system = navigator.userAgent;
if (utools.isWindows()) {
    system = "Windows";
} else if (utools.isMacOS()) {
    system = "MacOS"
} else if (utools.isLinux()) {
    system = "Linux"
}


export async function getToken() {
    const now = new Date();
    if (token === '' || now.getTime() > expired) {
        try {
            const res = await utools.fetchUserServerTemporaryToken();
            token = res.token;
            expired = res.expiredAt + now.getTime();
        } catch (e) {
            token = '';
            expired = 0;
        }
    }
    return token;
}

export async function getTokenThrow() {
    const now = new Date();
    if (token === '' || now.getTime() > expired) {
        const res = await utools.fetchUserServerTemporaryToken();
        token = res.token;
        expired = res.expiredAt + now.getTime();
    }
    return token;
}


async function request(url: string, event?: string, data?: string) {
    if (utools.isDev()) {
        return Promise.resolve();
    }
    navigator.sendBeacon(`https://utools.esion.xyz/open/statistics/${url}/v1`, JSON.stringify({
        "channel": isUtools ? 'utools' : 'chrome',
        "devicePixelRatio": devicePixelRatio + '',
        "height": window.innerHeight,
        "nativeId": utools.getNativeId(),
        "pluginId": Constant.uid,
        "system": system,
        "token": await getToken(),
        "version": Constant.version,
        "width": window.innerWidth,
        "data": data,
        "event": event
    }));
}

// TODO: 此处需要处理
export function trackEvent(event: string, data?: string) {
    if (useGlobalStore().privacy !== 1) {
        // 没有同意隐私协议
        return;
    }
    request('track', event, data)
        .catch(e => console.error(e));
}

export function enter(code: string, type: string) {
    request('enter', code, type)
        .catch(e => console.error(e));
}

export function out() {
    request('out')
        .catch(e => console.error(e));

}

export function paymentOpen(event?: string, data?: string) {
    request('payment/open', event, data)
        .catch(e => console.error(e));

}

export function paymentComplete(event?: string, data?: string) {
    request('payment/complete', event, data)
        .catch(e => console.error(e));
}

