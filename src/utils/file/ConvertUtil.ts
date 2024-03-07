import {turndownService} from "@/plugin/sdk/Turndown";
import Mammoth from "mammoth";
import JSZip from "jszip";
import {basename} from "@/utils/file/FileUtil";

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
