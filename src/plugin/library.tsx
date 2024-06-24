import {Notification, Typography, TypographyParagraph} from "@arco-design/web-vue";
import NotificationUtil from "@/utils/modal/NotificationUtil";
import {isUtools} from "@/global/BeanFactory";

const PATH = 'uTools/.plugin/library';

interface Library {
    label: string,
    name: string;
    path: string;
    url: string;
}

const mermaid: Library = {
    label: '流程图',
    name: 'mermaid.min.js',
    path: PATH,
    url: 'https://cdn.bootcdn.net/ajax/libs/mermaid/10.9.1/mermaid.min.js'
}
const katexCss: Library = {
    label: '数学公式 - css',
    name: 'katex.min.css',
    path: PATH,
    url: 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.9/katex.min.css'
}
const katexJs: Library = {
    label: '数学公式 - js',
    name: 'katex.min.js',
    path: PATH,
    url: 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.9/katex.min.js'
}
const katexRegularWoff2: Library = {
    label: '数学公式 - 常规字体2',
    name: 'KaTeX_Main-Regular.woff2',
    path: `${PATH}/fonts`,
    url: 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Main-Regular.woff2'
}
const katexItalicWoff2: Library = {
    label: '数学公式 - 斜体2',
    name: 'KaTeX_Math-Italic.woff2',
    path: `${PATH}/fonts`,
    url: 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Math-Italic.woff2'
}
const katexRegularWoff: Library = {
    label: '数学公式 - 常规字体',
    name: 'KaTeX_Main-Regular.woff',
    path: `${PATH}/fonts`,
    url: 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Main-Regular.woff'
}
const katexItalicWoff: Library = {
    label: '数学公式 - 斜体',
    name: 'KaTeX_Math-Italic.woff',
    path: `${PATH}/fonts`,
    url: 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Math-Italic.woff'
}
const katexRegularTtf: Library = {
    label: '数学公式 - 常规字体ttf',
    name: 'KaTeX_Main-Regular.ttf',
    path: `${PATH}/fonts`,
    url: 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Main-Regular.ttf'
}
const katexItalicTtf: Library = {
    label: '数学公式 - 斜体ttf',
    name: 'KaTeX_Math-Italic.ttf',
    path: `${PATH}/fonts`,
    url: 'https://cdn.bootcdn.net/ajax/libs/KaTeX/0.16.9/fonts/KaTeX_Math-Italic.ttf'
}
const Highlight: Library = {
    label: '语法高亮 - js',
    name: 'highlight.min.js',
    path: PATH,
    url: 'https://cdn.bootcdn.net/ajax/libs/highlight.js/11.9.0/highlight.min.js'
}
const CropperJs: Library = {
    label: '图片裁剪 - js',
    name: 'cropper.min.js',
    path: PATH,
    url: 'https://cdn.bootcdn.net/ajax/libs/cropperjs/1.6.2/cropper.min.js'
}
const CropperCss: Library = {
    label: '图片裁剪 - css',
    name: 'highlight.min.js',
    path: PATH,
    url: 'https://cdn.bootcdn.net/ajax/libs/cropperjs/1.6.2/cropper.min.css'
}
const ScreenFullJs: Library = {
    label: '全屏 - js',
    name: 'screenfull.min.js',
    path: PATH,
    url: 'https://cdn.bootcdn.net/ajax/libs/screenfull.js/5.2.0/screenfull.min.js'
}
const PrettierStandalone: Library = {
    label: '代码格式化 - 单独',
    name: 'standalone.js',
    path: PATH,
    url: 'https://cdn.bootcdn.net/ajax/libs/prettier/2.8.0/standalone.js'
}
const PrettierParseMarkdown: Library = {
    label: '代码格式化 - 解析markdown',
    name: 'parser-markdown.js',
    path: PATH,
    url: 'https://cdn.bootcdn.net/ajax/libs/prettier/2.8.0/parser-markdown.js'
}


const libraries = [mermaid, Highlight, ScreenFullJs,
    katexCss, katexJs,
    katexRegularWoff2, katexItalicWoff2, katexRegularWoff, katexItalicWoff, katexRegularTtf, katexItalicTtf,
    CropperJs, CropperCss,
    PrettierStandalone, PrettierParseMarkdown
];

function getLibrary(library: Library) {
    if (isUtools) {
        return window.preload.path.join(utools.getPath('appData'), PATH, library.name);
    }
    return mermaid.url;
}

/**
 * 检查流程图是否可用
 */
export function checkLibrary() {
    if (!isUtools) {
        return;
    }
    const results = new Array<Library>();
    for (let library of libraries) {
        const exist = window.preload.customer.checkFileExist(utools.getPath('appData'), library.path, library.name);
        if (!exist) {
            results.push(library);
        }
    }
    if (results.length > 0) {
        Notification.info({
            title: '第三方资源检测',
            closable: true,
            content: () => <Typography>
                <TypographyParagraph>
                    检测到以下资源不存在
                </TypographyParagraph>
                <TypographyParagraph>
                    <ul>
                        {results.map(e => <li>{e.label}</li>)}
                    </ul>
                </TypographyParagraph>
                <TypographyParagraph>
                    后台正在下载中
                </TypographyParagraph>
            </Typography>
        });
        Promise.any(results.map(e =>
            window.preload.customer.downloadFile(utools.getPath('appData'), e.path, e.name, e.url)))
            .then(() => Notification.success({
                content: "下载完成，请重新进入插件后使用，以免插件使用异常。",
                title: '第三方资源检测',
                duration: 10000,
            }))
            .catch(e => NotificationUtil.error(`下载失败，${e.message}`, '第三方资源检测'));
    }
}


// 获取相应的类库
export const getMermaidSrc = () => getLibrary(mermaid)
export const getKatexCss = () => getLibrary(katexCss);
export const getKatexJs = () => getLibrary(katexJs);
export const getHighlightJs = () => getLibrary(Highlight);
export const getCropperCss = () => getLibrary(CropperCss)
export const getCropperJs = () => getLibrary(CropperJs);
export const getScreenFullJs = () => getLibrary(ScreenFullJs);

export const getPrettierStandalone = () => getLibrary(PrettierStandalone);
export const getPrettierParseMarkdown = () => getLibrary(PrettierParseMarkdown);

