import {ConvertDriver} from "@/components/AuthDriver/ConvertDriver";
import Mammoth from "mammoth";
import {parseFileName} from "@/utils/file/FileUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import {ArticleSource, getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import JSZip from "jszip";
import {download, sleep} from "@/utils/BrowserUtil";
import {listToList} from "@/entity/ListTree";
import {useFolderStore} from "@/store/db/FolderStore";
import {getFromOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {toDateString} from "xe-utils";
import {turndownService} from "@/plugin/sdk/Turndown";

// TODO: 此处需要导出
export default class UtoolsConvertDriver implements ConvertDriver {

    async docxToMarkdown(folder: number, file: ArrayBuffer, title?: string): Promise<void> {
        // docx转html
        const resultObject = await Mammoth.convertToHtml({arrayBuffer: file})
        const html = resultObject.value;
        // html转markdown
        const content = turndownService.turndown(html);

        const articleId = await useArticleStore().add(getDefaultArticleIndex({
            name: parseFileName(title || '') || '导入文章-' + new Date().getTime(),
            folder
        }), getDefaultArticleBase(), content);
        // 切换文章
        useHomeEditorStore().openArticle(articleId);
        return Promise.resolve();
    }

    async docxToRichText(folder: number, file: ArrayBuffer, title?: string): Promise<void> {
        // docx转html
        const resultObject = await Mammoth.convertToHtml({arrayBuffer: file})
        const articleId = await useArticleStore().add(getDefaultArticleIndex({
            name: parseFileName(title || '') || '导入文章-' + new Date().getTime(),
            type: ArticleTypeEnum.RICH_TEXT,
            folder
        }), getDefaultArticleBase(), resultObject.value);
        // 切换文章
        useHomeEditorStore().openArticle(articleId);
        return Promise.resolve();
    }

    async htmlToMarkdown(folder: number, html: string, title?: string): Promise<void> {
        // html转markdown
        const content = turndownService.turndown(html);

        const articleId = await useArticleStore().add(getDefaultArticleIndex({
            name: parseFileName(title || '') || '导入文章-' + new Date().getTime(),
            folder
        }), getDefaultArticleBase(), content);
        // 切换文章
        useHomeEditorStore().openArticle(articleId);
        return Promise.resolve();
    }

    async textToArticle(folder: number, content: string, type: ArticleTypeEnum, title?: string): Promise<void> {
        let name = title || '导入文章-' + new Date().getTime();
        if (type !== ArticleTypeEnum.CODE) {
            name = parseFileName(title || '')
        }
        const articleId = await useArticleStore().add(getDefaultArticleIndex({
            name, type, folder
        }), getDefaultArticleBase(), content);
        // 切换文章
        useHomeEditorStore().openArticle(articleId);
        return Promise.resolve();
    }

    async zipToArticle(folder: number, file: Blob): Promise<void> {
        const instance = await JSZip.loadAsync(await file.arrayBuffer());
        let lastId = 0;
        for (let title in instance.files) {
            const text = await instance.files[title].async('text');
            await sleep(100);

            let type = ArticleTypeEnum.MARKDOWN;

            if (!title.endsWith(".md") && !title.endsWith(".markdown")) {
                // 既不是markdown结尾，也不是md结尾，那就是code
                type = ArticleTypeEnum.CODE;
            }

            lastId = await useArticleStore().add(getDefaultArticleIndex({
                type, folder, name: parseFileName(title),
            }), getDefaultArticleBase({source: '导入文章'}), text);

        }
        // 切换文章
        useHomeEditorStore().openArticle(lastId);
        return Promise.resolve();
    }

    async articleToZip(folder: number): Promise<void> {
        const articleMap = useArticleStore().articleMap;
        const zip = new JSZip();
        // 查询全部目录结构
        let map = listToList(useFolderStore().folders, useArticleStore().folderMap, folder);
        // 获取markdown内容
        for (let path of map.keys()) {
            const articleId = map.get(path);
            if (articleId) {
                const content = await getFromOneByAsync<ArticleSource>(
                    LocalNameEnum.ARTICLE_CONTENT + articleId);
                if (content.record) {
                    const articleIndex = articleMap.get(articleId);
                    if (articleIndex) {
                        if (articleIndex.type === ArticleTypeEnum.MARKDOWN || typeof articleIndex.type === 'undefined') {
                            path = path + '.md'
                        } else if (articleIndex.type === ArticleTypeEnum.RICH_TEXT) {
                            path = path + '.html';
                        }else {
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

}
