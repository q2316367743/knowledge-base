import {turndownService} from "@/plugin/sdk/Turndown";
import Mammoth from "mammoth";
import JSZip from "jszip";
import {basename} from "@/utils/file/FileUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import {listToList} from "@/entity/ListTree";
import {useFolderStore} from "@/store/db/FolderStore";
import {getFromOneByAsync} from "@/utils/utools/DbStorageUtil";
import {ArticleContent} from "@/entity/article/ArticleContent";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {download} from "@/utils/BrowserUtil";
import {toDateString} from "xe-utils";
import {MindMapTreeNode} from "@/pages/home/layout/editor-content/editor/MindMapEditor/domain";

/**
 * html转为markdown
 * @param html html内容
 */
export function htmlToMarkdown(html: string): string {
    return turndownService.turndown(html);
}

export function htmlToPlainText(html: string): string {
    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");
    return document.body.innerText;
}


export async function docxToHtml(docx: ArrayBuffer): Promise<string> {
    const resultObject = await Mammoth.convertToHtml({arrayBuffer: docx})
    return resultObject.value;
}

export async function docxToMarkdown(docx: ArrayBuffer): Promise<string> {
    const html = await docxToHtml(docx);
    return htmlToMarkdown(html);
}


export async function zipToFiles(file: File): Promise<File[]> {
    const files = new Array<File>()
    const jsZip = await JSZip.loadAsync(file);
    for (let path in jsZip.files) {
        const item = jsZip.files[path];
        if (item.dir) {
            continue;
        }
        const text = await item.async('blob');
        files.push(new File([text], basename(path)));
    }
    return files;
}

export async function articleToZip(folder: number): Promise<void> {
    const articleMap = useArticleStore().articleMap;
    const zip = new JSZip();
    // 查询全部目录结构
    let map = listToList(useFolderStore().folders, useArticleStore().folderMap, folder);
    // 获取markdown内容
    for (let path of map.keys()) {
        const articleId = map.get(path);
        if (articleId) {
            const content = await getFromOneByAsync<ArticleContent>(
                LocalNameEnum.ARTICLE_CONTENT + articleId);
            if (content.record) {
                const articleIndex = articleMap.get(articleId);
                if (articleIndex) {
                    if (articleIndex.type === ArticleTypeEnum.MARKDOWN || typeof articleIndex.type === 'undefined') {
                        path = path + '.md'
                    } else if (articleIndex.type === ArticleTypeEnum.RICH_TEXT) {
                        path = path + '.html';
                    } else {
                        // 其他的不导出
                        continue;
                    }
                    zip.file(path, content.record.content);
                }
            }
        }
    }
    const zipContent = await zip.generateAsync({type: "arraybuffer"});
    download(zipContent,
        "知识库|" + toDateString(new Date(), "yyyy-MM-dd_HH_mm_ss") + ".zip",
        "application/zip");
}

export function stringToBlob(str: string) {
    return new Blob([str], { type: 'text/plain' });
}

export function mindMapToMarkdown(data: any): string {
    const root = data.root as MindMapTreeNode;
    // TODO：使用广度遍历
    throw new Error("暂不支持思维导图问答");
}
