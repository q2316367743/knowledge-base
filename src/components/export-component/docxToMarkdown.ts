import Mammoth from 'mammoth';
import TurndownService, { Rule, Options } from 'turndown';

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


export const docxToMarkdown = async (file: ArrayBuffer): Promise<string> => {
    // docx转html
    const resultObject = await Mammoth.convertToHtml({arrayBuffer: new Uint8Array(file)})
        const html = resultObject.value;
    // html转markdown
    return turndownService.turndown(html);
}
