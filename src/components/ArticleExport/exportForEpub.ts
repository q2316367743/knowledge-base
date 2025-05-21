import JSZip from "jszip";
import {download, generateUUID} from "@/utils/BrowserUtil";
import {toDateTimeString} from "@/utils/lang/FormatUtil";
import {buildMdEngine, commonAsset, parseRichTextForAttachment} from "@/components/ArticleExport/exportForCommon";
import {listToList, listToTreeSpecial, treeEach} from "@/entity/ListTree";
import {useFolderStore} from "@/store/db/FolderStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getAttachmentByAsync, getFromOneByAsync} from "@/utils/utools/DbStorageUtil";
import {ArticleContent} from "@/entity/article/ArticleContent";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {_createDataByColumns, _createDataNotColumns} from "@/editor/HandsontableEditor/hooks/ExportHook";
import {isEmptyObj} from "openai/core";
import {keys} from "radash";
import {TreeOptionData} from "tdesign-vue-next/es/common";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

interface EpubItem {
    id: string;
    href: string;
    mediaType: string;
    title: string;
}

const initEpubItems: EpubItem[] = [{
    id: 'style',
    href: 'assets/style.css',
    mediaType: 'text/css',
    title: ''
}, {
    id: 'utools-export',
    href: 'assets/utools-export.css',
    mediaType: 'text/css',
    title: ''
}, {
    id: 'theme',
    href: 'assets/theme.js',
    mediaType: 'text/javascript',
    title: ''
}, {
    id: 'cover',
    href: 'assets/logo.jpg',
    mediaType: 'image/jpeg',
    title: ''
}, {
    id: 'JetBrainsMono-Regular',
    href: 'assets/JetBrainsMono-Regular.woff2',
    mediaType: 'font/woff2',
    title: ''
}, {
    id: 'about',
    href: 'html/about.html',
    mediaType: 'application/html+xml',
    title: '关于本书'
}];

/**
 * 导出笔记为epub文件
 * @param folder 笔记文件夹ID
 */
export async function exportForEpub(folder: number) {
    const epub = new JSZip();


    // 核心方法
    const {getArticleById} = useArticleStore();
    const {folderMap} = useArticleStore();
    const {folders} = useFolderStore();

    // 获取树
    let treeNodeData = listToTreeSpecial(folders, folder);
    let treeData = new Array<TreeOptionData>();
    treeEach(treeNodeData, treeData, folderMap);

    // 查询全部目录结构
    const map = listToList(folders, folderMap, folder);
    if (map.size === 0) {
        return Promise.reject('没有找到任何笔记');
    }
    const images = new Array<string>();
    // 文件索引
    const items = new Array<EpubItem>();
    const uuid = generateUUID();

    // 初始静态资源
    items.push(...initEpubItems);
    const engine = buildMdEngine(images);

    // 遍历目录结构
    for (let path of map.keys()) {
        const articleId = map.get(path);
        if (articleId) {
            const content = await getFromOneByAsync<ArticleContent<any>>(
                LocalNameEnum.ARTICLE_CONTENT + articleId);
            if (content.record) {
                const article = await getArticleById(articleId);
                if (article) {
                    const articleIndex = article.index;
                    let cnt = content.record.content;
                    if (articleIndex.type === ArticleTypeEnum.MARKDOWN || typeof articleIndex.type === 'undefined') {
                        // markdown

                        // @ts-ignore
                        cnt = engine.makeHtml(cnt);
                    } else if (articleIndex.type === ArticleTypeEnum.RICH_TEXT) {
                        // 富文本
                        // 富文本要替换掉图片的路径
                        // 此处需要将html中图片、视频的src中的链接替换为绝对路径
                        const result = parseRichTextForAttachment(cnt, '..');
                        cnt = result.content;
                        images.push(...result.attachments);
                    } else if (articleIndex.type === ArticleTypeEnum.CODE) {
                        // 代码笔记
                        cnt = '<pre><code>' + cnt + '</code></pre>';
                    } else if (articleIndex.type === ArticleTypeEnum.HANDSONTABLE) {
                        // 表格笔记
                        const data = cnt.data;
                        const columns = cnt.columns;
                        if (!data) {
                            continue;
                        }
                        const lines = columns ? _createDataByColumns(data, columns) : _createDataNotColumns(data);
                        if (isEmptyObj(lines)) {
                            continue;
                        }
                        const cols = keys(lines[0]);
                        // 将对象数组转为html表格，将第一行的标题作为表头，其余行作为数据

                        cnt = '<table><thead><tr>' +
                            cols.map(c => '<th>' + c + '</th>').join('') +
                            '</tr></thead><tbody>' +
                            lines.map(line => '<tr>' +
                                cols.map(col => '<td>' + line[col] + '</td>').join('') +
                                '</tr>').join('') +
                            '</tbody></table>';
                    } else {
                        // 其他的不导出
                        continue;
                    }
                    epub.file(`OEBPS/html/${articleId}.html`, `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8" />
<link href="../assets/style.css" type="text/css" rel="stylesheet" />
<link href="../assets/utools-export.css" type="text/css" rel="stylesheet" />
<link href="../assets/logo.png" type="image/png" rel="icon" />
<title>${path}</title>
</head>
<body>
<div class="cherry-markdown">${cnt}</div>
</body>
<script src="../assets/theme.js"></script>
</html>`);
                    items.push({
                        id: 'article' + articleId,
                        title: articleIndex.name,
                        // 增加描述
                        mediaType: 'application/html+xml',
                        href: `html/${articleId}.html`,
                    })
                }
            }
        }
    }

    // 附件
    // 图片资源的处理
    for (let image of images) {
        const attachment = await getAttachmentByAsync(image);
        if (attachment) {
            epub.file(`OEBPS${image}`, attachment);
            items.push({
                id: image,
                title: image,
                mediaType: attachment.type,
                href: `${image.substring(1)}`,
            });
        }
    }

    // META-INF
    epub.file("META-INF/container.xml", `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles> 
</container>`);
// OEBPS
    // content.opf
    epub.file("OEBPS/content.opf", `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid">
  <metadata>
    <dc:title>知识库</dc:title>
    <dc:language>zh-CN</dc:language>
    <dc:creator>${InjectionUtil.getUser()?.nickname || "匿名"}</dc:creator>
    <dc:identifier id="bookid">urn:uuid${uuid}</dc:identifier>
    <dc:date>${toDateTimeString(new Date(), "YYYY-MM-DD")}</dc:date>
    <dc:contributor>知识库 [https://u.tools/plugins/detail/%E7%9F%A5%E8%AF%86%E5%BA%93/]</dc:contributor>
    <meta property="dcterms:modified">${toDateTimeString(new Date(), "YYYY-MM-DDTHH:mm:ssZ")}</meta>
    <meta name="cover" content="assets/logo.jpg" />
  </metadata>
  <manifest>
    ${items.map(item => `<item id="${item.id}" href="${item.href}" media-type="${item.mediaType}"/>`)
        .join("\n")}
  </manifest>
  <spine toc="ncx">
    ${items.filter(e => e.mediaType === 'application/html+xml')
        .map(e => `<itemref idref="${e.id}"/>`)
        .join("\n")}
  </spine>
</package>`);
    // toc.ncx
    // TODO: 目录目前无效
    epub.file("OEBPS/toc.ncx", `<?xml version='1.0' encoding='utf-8'?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="zh">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${uuid}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle>
    <text>知识库</text>
  </docTitle>
  <navMap>
     ${items.filter(e => e.mediaType === 'application/html+xml')
        .map((e, i) => `<navPoint id="np_${i + 1}" playOrder="${i + 1}">
        <navLabel>
          <text>${e.title}</text>
        </navLabel>
      <content src="${e.href}"/>
    </navPoint>`).join("\n")}
  </navMap>
</ncx>`);
    // 关于
    epub.file("OEBPS/html/about.html", `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<link href="../assets/style.css" type="text/css" rel="stylesheet">
<link href="../assets/utools-export.css" type="text/css" rel="stylesheet">
<link href="../assets/logo.png" type="image/png" rel="icon">
<title>关于</title>
</head>
<body>
<div class="cherry-markdown">
<h1>关于</h1>
<p>知识库插件由<a href="https://u.tools/">uTools</a>开发，基于<a href="https://github.com/markdown-it/markdown-it">markdown-it</a>和<a href="https://github.com/handsontable/handsontable">handsontable</a>实现。</p>
<p>感谢<a href="https://github.com/Tencent/tdesign-vue-next">TDesign</a>的开源组件库，让我可以快速实现功能。</p>
<p>感谢<a href="https://www.jetbrains.com/zh-cn/lp/mono/">JetBrains Mono</a>字体，让我可以快速实现代码高亮。</p>
<p>感谢<a href="https://www.iconfont.cn/">iconfont</a>的图标库，让我可以快速实现图标。</p>
<p>感谢<a href="https://www.markdownguide.org/">markdown guide</a>的文档，让我可以快速学习markdown语法。</p>
</div>
</body>
<script src="../assets/theme.js"></script>
</html>
`);
    // 公共资源处理
    await commonAsset(epub, 'OEBPS/assets');
    // 默认文件
    epub.file("mimetype", "application/epub+zip");
    // 导出epub文件
    const blob = await epub.generateAsync({type: "arraybuffer"});
    download(blob,
        "知识库|" + toDateTimeString(new Date(), "YYYY-MM-DD_HH_mm_ss") + ".epub",
        "application/epub+zip");
}
