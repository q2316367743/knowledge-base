import {renderAttachmentBaseUrl} from "@/plugin/server";
import JSZip from "jszip";
import UtoolsStyle from '@/assets/style/utools-export.css?raw'
import style from "cherry-markdown/dist/cherry-markdown.min.css?raw";
import JetBrainsMono from "@/assets/fonts/JetBrainsMono-Regular.woff2";

interface ParserRichTextForAttachmentResult {
    content: string;
    attachments: Array<string>;
}

export function parseRichTextForAttachment(content: string): ParserRichTextForAttachmentResult {
    const attachments = new Array<string>();
    const document = new DOMParser().parseFromString(content, 'text/html');
    const baseUrl = renderAttachmentBaseUrl();
    document.body.querySelectorAll('img, video, source').forEach(item => {
        const src = item.getAttribute('src');
        if (src) {
            if (src.startsWith(baseUrl)) {
                // 获取key
                let key = new URL(src).searchParams.get('key');
                if (key) {
                    // 获取key，
                    attachments.push(key);
                    // 替换src
                    item.setAttribute('src', key.substring(1))
                }
            }
        }
    });
    return {
        content: document.body.innerHTML,
        attachments: attachments
    }
}

/**
 * 公共资源处理
 * @param zip zip文件
 * @param assetUrl 资源根路径
 */
export async function commonAsset(zip: JSZip, assetUrl: string) {
    // 这里可以添加一些公共资源，比如字体文件等

    // 样式的处理
    zip.file(`${assetUrl}/style.css`, style);
    zip.file(`${assetUrl}/utools-export.css`, UtoolsStyle);
    // 主题的处理
    zip.file(`${assetUrl}/theme.js`, `
// 判断是否是暗黑模式
const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
if (isDark){
    document.querySelector('.cherry-markdown').classList.add('theme__dark');
}
    `)
    // 图片文件
    let logo = await fetch('./logo.png').then((res) => res.blob());
    zip.file(`${assetUrl}/logo.png`, logo);
    // 字体
    let font = await fetch(JetBrainsMono).then((res) => res.blob());
    zip.file(`${assetUrl}/JetBrainsMono-Regular.woff2`, font);
}
