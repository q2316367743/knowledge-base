import MessageUtil from "@/utils/MessageUtil";
import {convert} from "@/global/BeanFactory";

export function htmlToArticle(content: string) {
    const zone = JSON.parse(content);
    if (typeof zone.title === 'undefined' || zone.title.trim() === '') {
        MessageUtil.error("文章标题为必填！");
        return;
    }
    if (typeof zone.content === 'undefined' || zone.content.trim() === '') {
        MessageUtil.error("文章内容为必填！");
        return;
    }
    return convert.htmlToMarkdown(content);
}
