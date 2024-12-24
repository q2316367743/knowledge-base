import {useUmami} from "@/plugin/umami";
import {useArticleStore} from "@/store/db/ArticleStore";
import JSZip from "jszip";
import {listToList} from "@/entity/ListTree";
import {useFolderStore} from "@/store/db/FolderStore";
import {getAttachmentByAsync, getFromOneByAsync} from "@/utils/utools/DbStorageUtil";
import {ArticleContent} from "@/entity/article/ArticleContent";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {download} from "@/utils/BrowserUtil";
import {toDateString} from "@/utils/lang/FormatUtil";
import {
    _createDataByColumns, _createDataNotColumns,
} from "@/editor/HandsontableEditor/hooks/ExportHook";
import {isEmptyObj} from "openai/core";
import {keys} from "radash";
import {buildMdEngine, commonAsset, parseRichTextForAttachment} from "@/components/ArticleExport/exportForCommon";

interface Index {
    t: string;
    d: string;
    p: string;
}

export async function exportToUTools(folder: number) {
    useUmami.track("导出数据为uTools文档插件")

    const indexes = new Array<Index>();
    const images = new Array<string>();

    const {getArticleById} = useArticleStore();
    const zip = new JSZip();
    // 查询全部目录结构
    const map = listToList(useFolderStore().folders, useArticleStore().folderMap, folder);
    const engine = buildMdEngine(images);
    // 获取markdown内容
    for (let path of map.keys()) {
        const articleId = map.get(path);
        if (articleId) {
            const content = await getFromOneByAsync<ArticleContent<any>>(
                LocalNameEnum.ARTICLE_CONTENT + articleId);
            if (content.record) {
                // TODO: 此处应获取文章全部信息，包括描述
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
                        const result = parseRichTextForAttachment(cnt);
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
                    zip.file(`/doc/${articleId}.html`, `<!DOCTYPE html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<link href="../assets/style.css" type="text/css" rel="stylesheet">
<link href="../assets/utools-export.css" type="text/css" rel="stylesheet">
<link href="../assets/logo.png" type="image/png" rel="icon">
<title>${path}</title>
</head>
<body>
<div class="cherry-markdown">${cnt}</div>
</body>
<script src="../assets/theme.js"></script>
</html>`);
                    indexes.push({
                        t: articleIndex.name,
                        // 增加描述
                        d: article.base.description,
                        p: `doc/${articleId}.html`,
                    })
                }
            }
        }
    }
    zip.file('indexes.json', JSON.stringify(indexes))
    // 公共文件
    zip.file('/preload.js', `
window.exports = {
   "application": { // 注意：键对应的是 plugin.json 中的 features.code
      mode: "doc", // 文档模式
      args: {
         indexes: require('./indexes.json'),
         // 子输入框为空时的占位符，默认为字符串"搜索"
         placeholder: "搜索"
      }
   }
}
`)
    // 配置文件
    zip.file('/plugin.json', `
{
    "preload": "preload.js",
    "logo": "logo.png",
    "platform": [
        "win32",
        "darwin",
        "linux"
    ],
    "features": [
        {
            "code": "application",
            "explain": "知识库导出文档",
            "icon": "logo.png",
            "platform": [
                "win32",
                "darwin",
                "linux"
            ],
            "cmds": [
                "知识库导出文档"
            ]
        }
    ]
}
`);
    // 说明

    zip.file('/README.md', "#  知识库导出文档插件\n" +
        "\n" +
        "\n" +
        "该插件可以将知识库导出为uTools文档插件的格式，以便导入到uTools中。\n" +
        "\n" +
        "## 如何使用？\n" +
        "\n" +
        "1. 点击文件夹中的“更多” ->  “导出” -> “uTools文档插件”\n" +
        "2. 选择要导出的知识库目录\n" +
        "3. 点击“知识库导出文档”按钮\n" +
        "4. 等待导出完成，下载文件\n" +
        "5. 打开uTools，前往插件市场下载**uTools开发者工具**\n" +
        "6. 打开**uTools开发者工具**-> “新建项目” -> “创建”\n" +
        "7. 解压下载的zip文件到一个目录\n" +
        "8. 点击**选择 plugin.json 文件**，选择刚才解压的文件夹中的**plugin.json**\n" +
        "\n" +
        "## 注意\n" +
        "\n" +
        "1. 导出的文件会包含所有文章的markdown内容，但不会包含富文本、代码笔记、表格笔记等其他格式的内容。\n" +
        "2. 导出的文件会包含所有文章的标题、创建时间、修改时间等信息，但不会包含目录结构。\n" +
        "3. 导出的文件会包含一个preload.js文件，该文件是uTools文档插件的启动文件，请不要修改。\n" +
        "4. 导出的文件会包含一个indexes.json文件，该文件是uTools文档插件的索引文件，请不要修改。\n" +
        "5. 导出的文件会包含一个doc目录，该目录下包含所有文章的html文件，请不要修改。\n" +
        "\n" +
        "## 修改\n" +
        "\n" +
        "1. 可以修改logo.png为你自己的插件图标\n" +
        "2. 修改plugin.json中的`features[0].explain`和`features[0].cmds`，其他的尽量不要修改\n" +
        "\n" +
        "- **features[0].explain**：对此功能的说明，将在搜索列表对应位置中显示\n" +
        "- **features[0].cmds**：这个是实际使用的关键字，请注意修改\n")

    // 图片资源的处理
    for (let image of images) {
        const attachment = await getAttachmentByAsync(image);
        if (attachment) {
            zip.file(image, attachment);
        }
    }

    await commonAsset(zip, '/assets');


    const zipContent = await zip.generateAsync({type: "arraybuffer"});
    download(zipContent,
        "知识库|" + toDateString(new Date(), "YYYY-MM-DD_HH_mm_ss") + ".zip",
        "application/zip");
}
