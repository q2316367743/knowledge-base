import {ConvertDriver} from "@/components/AuthDriver/ConvertDriver";
import Mammoth from "mammoth";
import {parseFileName} from "@/utils/FileUtil";
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

export default class UtoolsConvertDriver implements ConvertDriver {

    async docxToMarkdown(file: ArrayBuffer, title?: string): Promise<void> {
        // docx转html
        const resultObject = await Mammoth.convertToHtml({arrayBuffer: file})
        const html = resultObject.value;
        // html转markdown
        const content = turndownService.turndown(html);

        const articleId = await useArticleStore().add(getDefaultArticleIndex({
            name: parseFileName(title || '') || '导入文章-' + new Date().getTime(),
        }), getDefaultArticleBase(), content);
        // 切换文章
        useHomeEditorStore().setId(articleId);
        return Promise.resolve();
    }

    async docxToRichText(file: ArrayBuffer, title?: string): Promise<void> {
        // docx转html
        const resultObject = await Mammoth.convertToHtml({arrayBuffer: file})
        const articleId = await useArticleStore().add(getDefaultArticleIndex({
            name: parseFileName(title || '') || '导入文章-' + new Date().getTime(),
            type: ArticleTypeEnum.RICH_TEXT
        }), getDefaultArticleBase(), resultObject.value);
        // 切换文章
        useHomeEditorStore().setId(articleId);
        return Promise.resolve();
    }

    async htmlToMarkdown(html: string, title?: string): Promise<void> {
        // html转markdown
        const content = turndownService.turndown(html);

        const articleId = await useArticleStore().add(getDefaultArticleIndex({
            name: parseFileName(title || '') || '导入文章-' + new Date().getTime(),
        }), getDefaultArticleBase(), content);
        // 切换文章
        useHomeEditorStore().setId(articleId);
        return Promise.resolve();
    }

    async textToArticle(content: string, type: ArticleTypeEnum, title?: string): Promise<void> {
        let name = title || '导入文章-' + new Date().getTime();
        if (type !== ArticleTypeEnum.CODE) {
            name = parseFileName(title || '')
        }
        const articleId = await useArticleStore().add(getDefaultArticleIndex({
            name, type
        }), getDefaultArticleBase(), content);
        // 切换文章
        useHomeEditorStore().setId(articleId);
        return Promise.resolve();
    }

    async zipToArticle(file: Blob): Promise<void> {
        const instance = await JSZip.loadAsync(await file.arrayBuffer());
        let lastId = 0;
        for (let title in instance.files) {
            if (!title.endsWith(".md") && !title.endsWith(".markdown")) {
                // 既不是markdown结尾，也不是md结尾
                continue;
            }
            const text = await instance.files[title].async('text');
            await sleep(100);

            lastId = await useArticleStore().add(getDefaultArticleIndex({
                name: parseFileName(title),
            }), getDefaultArticleBase({source: '导入文章'}), text);

        }
        // 切换文章
        useHomeEditorStore().setId(lastId);
        return Promise.resolve();
    }

    async articleToZip(): Promise<void> {
        const articleMap = useArticleStore().articleMap;
        const zip = new JSZip();
        // 查询全部目录结构
        let map = listToList(useFolderStore().folders, useArticleStore().folderMap);
        // 获取markdown内容
        for (let path of map.keys()) {
            const articleId = map.get(path);
            if (articleId) {
                const content = await getFromOneByAsync<ArticleSource>(
                    LocalNameEnum.ARTICLE_CONTENT + articleId);
                if (content.record) {
                    const articleIndex = articleMap.get(articleId);
                    if (articleIndex) {
                        if (articleIndex.type === ArticleTypeEnum.MARKDOWN) {
                            path = path + '.md'
                        } else if (articleIndex.type === ArticleTypeEnum.RICH_TEXT) {
                            path = path + '.html';
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
