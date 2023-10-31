import TurndownService, {Options, Rule} from "turndown";


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
        } catch (_) {
        }
        return '```' + language + '\n' + content + '\n```';
    }
} as Rule;

const instance = new TurndownService(getDefaultTurndownSetting());
instance.addRule('codeLanguage', codeLanguage);

export const turndownService = instance;
