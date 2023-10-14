import MessageUtil from "@/utils/MessageUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";

export async function htmlToArticle(content: string) {
    const zone = JSON.parse(content);
    if (typeof zone.title === 'undefined' || zone.title.trim() === '') {
        MessageUtil.error("文章标题为必填！");
        return;
    }
    if (typeof zone.content === 'undefined' || zone.content.trim() === '') {
        MessageUtil.error("文章内容为必填！");
        return;
    }
    const id = await useArticleStore().add(getDefaultArticleIndex({
        name: zone.title,
        folder: 0,
        preview: false
    }), getDefaultArticleBase({
        tags: zone.tags || [],
        source: zone.source || '',
        description: zone.description || '',
        sourceUrl: zone.sourceUrl || ''
    }), zone.content);
    useHomeEditorStore().setId(id);
}
