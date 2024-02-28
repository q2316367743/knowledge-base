import MessageUtil from "@/utils/MessageUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";

export async function htmlToArticle(content: string) {
    const article = JSON.parse(content);
    if (typeof article.title === 'undefined' || article.title.trim() === '') {
        MessageUtil.error("文章标题为必填！");
        return;
    }
    if (typeof article.content === 'undefined' || article.content.trim() === '') {
        MessageUtil.error("文章内容为必填！");
        return;
    }
    const id = await useArticleStore().add(getDefaultArticleIndex({
        name: article.title,
        folder: 0,
        preview: false
    }), getDefaultArticleBase({
        tags: article.tags || [],
        source: article.source || '',
        description: article.description || '',
        sourceUrl: article.sourceUrl || ''
    }), article.content);
    useHomeEditorStore().setId(id);
}
