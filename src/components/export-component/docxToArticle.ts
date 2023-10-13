import Mammoth from 'mammoth';
import TurndownService, { Rule, Options } from 'turndown';
import {useFileSystemAccess} from "@vueuse/core";
import {ArticleIndex} from "@/entity/article";
import {parseFileName} from "@/utils/BrowserUtil";

const LANGUAGE_PREFIX = 'language-'

export function getDefaultTurndownSetting(): Options {
    return {
        headingStyle: 'atx',
        hr: '***',
        br: '',
        bulletListMarker: '-',
        codeBlockStyle: 'indented',
        emDelimiter: '_',
        fence: '```',
        strongDelimiter: '**',
        linkStyle: 'inlined',
        linkReferenceStyle: 'full'
    }
}

const codeLanguage = {
    filter: 'pre',
    replacement: (content: string, node: Node) => {
        let language = '';
        try {
            let childNodes = node.childNodes;
            for (let i = 0; i < childNodes.length; i++) {
                let node = childNodes.item(i);
                // @ts-ignore
                let clsList = node.classList as string[];
                for (let cls of clsList) {
                    if (cls.startsWith(LANGUAGE_PREFIX)) {
                        language = cls.substring(LANGUAGE_PREFIX.length);
                    }
                }
            }
        } catch (_) { }
        return '```' + language + '\n' + content + '\n```';
    }
} as Rule;



const turndownService = new TurndownService(getDefaultTurndownSetting());
turndownService.addRule('codeLanguage', codeLanguage);


export const docxToArticle = async (): Promise<{
    title: string;
    content: string;
}> => {

    const docx = useFileSystemAccess({
        dataType: 'ArrayBuffer',
        types: [{
            description: 'docx文档',
            accept: {
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document    ': ['.docx']
            }
        }]
    });

    await docx.open();
    const contentWrap = docx.data.value;
    if (!contentWrap) {
        return Promise.reject("文章内容不存在")
    }
    const title = docx.fileName.value;


    // docx转html
    const resultObject = await Mammoth.convertToHtml({arrayBuffer: new Uint8Array(contentWrap)})
    const html = resultObject.value;
    // html转markdown
    const content =  turndownService.turndown(html);

    return {
        title: parseFileName(title) || '导入文章-' + new Date().getTime(),
        content
    }
}
