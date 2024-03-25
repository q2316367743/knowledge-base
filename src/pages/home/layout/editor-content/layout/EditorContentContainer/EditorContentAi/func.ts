import CherryEngine from "cherry-markdown/dist/cherry-markdown.engine.core";
import MessageUtil from "@/utils/modal/MessageUtil";

let user = utools.getUser();
const nickname = user ? user.nickname : '游客';

export function renderRole(role: string) {
    switch (role) {
        case "system":
            return "系统";
        case "user":
            return nickname;
        case "assistant":
            return "AI小助手";
        case "tool":
            return "工具";
        case "function":
            return "方法";
        default:
            return role;
    }
}

export function renderContent(content: string) {
    const engine = new CherryEngine({});
    // @ts-ignore
    return engine.makeHtml(content);
}

export const execCopy = (content: string) => {
    utools.copyText(content);
    MessageUtil.success("已复制到剪切板")
}
