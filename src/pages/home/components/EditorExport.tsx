import {access} from "@/plugin/Statistics";
import {useGlobalStore} from "@/store/GlobalStore";
import {articleToZip} from "@/utils/file/ConvertUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import JSZip from "jszip";
import {listToList} from "@/entity/ListTree";
import {useFolderStore} from "@/store/db/FolderStore";
import {getFromOneByAsync} from "@/utils/utools/DbStorageUtil";
import {ArticleContent} from "@/entity/article/ArticleContent";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {download} from "@/utils/BrowserUtil";
import {toDateString} from "@/utils/lang/FormatUtil";
import {
    _createDataByColumns, _createDataNotColumns,
} from "@/editor/HandsontableEditor/hooks/ExportHook";
import {isEmptyObj} from "openai/core";

export function exportToMd(pid: number) {
    access("导出数据为md")
    useGlobalStore().startLoading("正在准备数据")
    articleToZip(pid)
        .then(() => MessageUtil.success("导出成功"))
        .catch(e => MessageUtil.error("导出失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

export async function exportToUTools(folder: number) {
    access("导出数据为uTools文档插件")

    const articleMap = useArticleStore().articleMap;
    const zip = new JSZip();
    // 查询全部目录结构
    let map = listToList(useFolderStore().folders, useArticleStore().folderMap, folder);
    // 获取markdown内容
    for (let path of map.keys()) {
        const articleId = map.get(path);
        if (articleId) {
            const content = await getFromOneByAsync<ArticleContent<any>>(
                LocalNameEnum.ARTICLE_CONTENT + articleId);
            if (content.record) {
                const articleIndex = articleMap.get(articleId);
                if (articleIndex) {
                    let cnt = content.record.content;
                    if (articleIndex.type === ArticleTypeEnum.MARKDOWN || typeof articleIndex.type === 'undefined') {
                        // markdown
                        // TODO: 转为html
                    } else if (articleIndex.type === ArticleTypeEnum.RICH_TEXT) {
                        // 富文本
                    } else if (articleIndex.type === ArticleTypeEnum.CODE) {
                        // 代码笔记
                        // TODO: 转为html-pre
                        cnt = '<pre><code>' + cnt + '</code></pre>';
                    } else if (articleIndex.type === ArticleTypeEnum.HANDSONTABLE) {
                        // 表格笔记
                        const data =  cnt.data;
                        const columns =  cnt.columns;
                        if (!data) {
                            continue;
                        }
                        const lines = columns ? _createDataByColumns(data, columns) : _createDataNotColumns(data);
                        if (isEmptyObj(lines)) {
                            continue;
                        }
                        // 将对象数组转为html表格
                        cnt = '<table>' + lines.map(line => '<tr>' + line.map(cell => '<td>' + cell + '</td>').join('') + '</tr>').join('') + '</table>';
                    } else {
                        // 其他的不导出
                        continue;
                    }
                    zip.file(articleId + '.html', cnt);
                }
            }
        }
    }
    const zipContent = await zip.generateAsync({type: "arraybuffer"});
    download(zipContent,
        "知识库|" + toDateString(new Date(), "YYYY-MM-DD_HH_mm_ss") + ".zip",
        "application/zip");
}
