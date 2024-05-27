import MessageUtil from '@/utils/modal/MessageUtil';
import {copy, generateUUID} from "@/utils/BrowserUtil";
import {createDbPromiseInstance} from "@/plugin/utools/db";
import {createDbStorage} from "@/plugin/utools/dbStorage";


// 模拟utools声明

export interface DbDoc {
    _id: string,
    _rev?: string,

    [key: string]: any
}

export interface DbReturn {
    id: string,
    rev?: string,
    ok?: boolean,
    error?: boolean,
    name?: string,
    message?: string
}

export type ShowOpenDialogOptionProperty = 'openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles'
    | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory' | 'dontAddToRecent';

export interface ShowOpenDialogOptionFilter {
    name: string;
    extensions: Array<string>
}

export type RedirectPreloadType = 'text' | 'img' | 'files';

export interface RedirectPreload {
    type: RedirectPreloadType;
    data: any;
}

export interface ShowOpenDialogOption {
    title?: string,
    defaultPath?: string,
    buttonLabel?: string,
    filters?: Array<ShowOpenDialogOptionFilter>,
    properties?: Array<ShowOpenDialogOptionProperty>,
    message?: string,
    securityScopedBookmarks?: boolean
}

function isMacOS(): boolean {
    return /macintosh|mac os x/i.test(navigator.userAgent);
}

function isWindows(): boolean {
    let agent = navigator.userAgent.toLowerCase();
    return agent.indexOf("win") >= 0 || agent.indexOf("wow") >= 0;
}

let web = {
    db: {
        promises: createDbPromiseInstance(),
        getAttachment(docId: string) {
            return ''
        }
    },
    dbStorage: createDbStorage(),
    getPath(): string {
        return '';
    },
    shellOpenExternal(url: string): void {
        window.open(url);
    },
    redirect(label: string | string[], payload: string | RedirectPreload) {
        window.open(`utools://${label}/${label}?${typeof payload === 'string' ? payload : JSON.stringify(payload)}`)
    },
    setFeature() {
        MessageUtil.warning("web环境不支持设置feature，请使用utools版本");
    },
    isDarkColors(): boolean {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    },
    onPluginEnter(callback: (action: { code: string, type: string, payload: any }) => void): void {
        document.addEventListener('load', () => callback({code: 'application', type: '', payload: {}}));
    },
    showOpenDialog(options: ShowOpenDialogOption): (string[]) | (undefined) {
        MessageUtil.warning("web环境不支持打开文件操作，请使用utools版本");
        return [];
    },
    setSubInput(action: { text: string }): boolean {
        console.warn("web环境不支持子输入框事件");
        return true
    },
    setSubInputValue() {
        console.warn("web环境不支持子输入框事件");
    },
    fetchUserPayments(): Promise<any[]> {
        return Promise.resolve([]);
    },
    getUser() {
        return {avatar: "", nickname: "web用户", type: ""};
    },
    fetchUserServerTemporaryToken(): Promise<{ token: string, expiredAt: number }> {
        let token = localStorage.getItem("token");
        if (!token) {
            token = generateUUID();
            localStorage.setItem("token", token);
        }
        return Promise.resolve({
            token,
            expiredAt: 999999999
        })
    },
    isDev(): boolean {
        return import.meta.env.DEV;
    },
    isMacOS,
    isWindows,
    isLinux(): boolean {
        return !isMacOS() && !isWindows();
    },
    getNativeId() {
        let nativeId = localStorage.getItem("nativeId");
        if (!nativeId) {
            nativeId = generateUUID();
            localStorage.setItem("nativeId", nativeId);
        }
        return nativeId;
    },
    onMainPush(callback: (action: { code: string, type: string, payload: any }) => {
        icon?: string,
        text: string,
        title?: string
    }[], selectCallback: (action: {
        code: string,
        type: string,
        payload: any,
        option: { icon?: string, text: string, title?: string }
    }) => void): void {
        console.warn("web环境不支持主程序推送事件");
    },
    removeSubInput() {
        console.warn("web环境不支持子输入框事件");
    },
    getFeatures(codes?: Array<string>): Array<any> {
        console.warn("web环境不支持feature功能");
        return [];
    },
    copyText(content: string) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(content)
                .then(() => console.debug("写入剪切板"))
                .catch(e => {
                    throw e;
                })
        } else {
            copy(content, false);
        }
    },
    onPluginOut(callback: () => void) {
        window.addEventListener('close', callback);
    }
}

export const utools = window.utools || web;
