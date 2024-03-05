import {turndownService} from "@/plugin/sdk/Turndown";
import Mammoth from "mammoth";

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
