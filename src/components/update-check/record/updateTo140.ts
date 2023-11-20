import {useArticleStore} from "@/store/db/ArticleStore";
import ArticleTypeEnum from "@/enumeration/ArticleTypeEnum";
import {getFromOneByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";
import {ArticleContent} from "@/entity/article/ArticleContent";

/*
核心：将富文本做一次迁移
列：<p></p>
图片：<img src="">
表格：<table></table>
列表：<ol></ol>
标题：<h2></h2>
*/
export async function updateTo140FromUnder() {
    let articles = useArticleStore().articles;
    articles = articles.filter(e => e.type === ArticleTypeEnum.EDITOR_JS);
    console.log(articles)
    // 循环
    for (let article of articles) {
        // 获取内容
        const content = await getFromOneByAsync<ArticleContent<RootObject>>(LocalNameEnum.ARTICLE_CONTENT + article.id);
        if (!content.record) {
            // 没有内容
            continue;
        }
        let items = new

        Array<string>();
        try {
            for (let block of content.record.content.blocks) {
                if (block.type === 'header') {
                    items.push(`<h${block.data.level}>${block.data.text}</h${block.data.level}>`);
                } else if (block.type === 'Link') {
                    items.push(`<a href="${block.data.link}">${block.data.link}</a>`);
                } else if (block.type === 'list') {
                    if (block.data.style === 'ordered') {
                        items.push(`<ol>${(block.data.items as Array<string>).map(e => `<li>${e}</li>`)}</ol>`);
                    } else {
                        items.push(`<ul>${(block.data.items as Array<string>).map(e => `<li>${e}</li>`)}</ul>`);
                    }
                } else if (block.type === 'Quote') {
                    items.push(`<blockquote><h3>${block.data.caption}</h3><p>${block.data.text}</p></blockquote>`);
                } else if (block.type === 'Warning') {
                    items.push(`<p class="arco-alert"><h3>${block.data.message}</h3><p>${block.data.text}</p></p>`);
                } else if (block.type === 'Code') {
                    items.push(`<pre><code>${block.data.code}</code></pre>`);
                } else if (block.type === 'Raw') {
                    items.push(`<pre><code>${block.data.code}</code></pre>`);
                } else if (block.type === 'table') {
                    const tr = new Array<string>()
                    if (block.data.content && block.data.content.length > 0) {
                        if (block.data.withHeadings) {
                            // 第一行是表头
                            tr.push(`<tr>${block.data.content[0].map(e => `<th>${e}</th>`)}</tr>`);
                            block.data.content
                                .slice(1, Math.min(block.data.content.length, 1))
                                .map(e => `<tr>${e.map(ee => `<td>${ee}</td>`)}</tr>`)
                                .forEach(e => tr.push(e));
                        } else {
                            block.data.content
                                .map(e => `<tr>${e.map(ee => `<td>${ee}</td>`)}</tr>`)
                                .forEach(e => tr.push(e));
                        }
                    }
                } else if (block.type === 'UtoolsImage') {
                    items.push(`<img src="${block.data.url}" alt="utools图片" />`);
                }
            }
            // 赋值
            await saveOneByAsync<ArticleContent>(LocalNameEnum.ARTICLE_CONTENT + article.id, {
                content: items.join("\n")
            }, content.rev);
        } catch (e) {
            MessageUtil.error("富文本文档迁移错误", e);
        }
    }
}


interface RootObject {
    time: number;
    blocks: Block[];
    version: string;
}

interface Block {
    id: string;
    type: BlockType;
    data: Data;
}

interface Data {
    text?: string;
    level?: number;
    link?: string;
    meta?: Meta;
    style?: string;
    items?: (Item | string)[];
    caption?: string;
    alignment?: string;
    title?: string;
    message?: string;
    withHeadings?: boolean;
    content?: string[][];
    code?: string;
    html?: string;
    url?: string;
}

interface Item {
    text: string;
    checked: boolean;
}

interface Meta {
}

type BlockType =
    'header'
    | 'Link'
    | 'list'
    | 'checklist'
    | 'Quote'
    | 'Warning'
    | 'table'
    | 'Code'
    | 'Raw'
    | 'UtoolsImage'

