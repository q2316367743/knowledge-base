import {
    getFromOneByAsync,
    listByAsync,
    saveListByAsync,
    saveOneByAsync
} from "@/utils/utools/DbStorageUtil";
import {
    ArticleBase,
    ArticleIndex,
    getDefaultArticleBase,
    getDefaultArticleIndex
} from "@/entity/article";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {toRaw} from "vue";
import {ArticleContent} from "@/entity/article/ArticleContent";

/**
 * 本次更新主要是将临时文章增加到一篇文章里
 */
export async function updateTo150FromUnder() {
    // 获取内容
    const contentWrap = await getFromOneByAsync<string>(LocalNameEnum.KEY_EDITOR_CONTENT);
    if (contentWrap.record) {
        // 新增文章
        await add(getDefaultArticleIndex({
            name: "草稿箱",
        }), getDefaultArticleBase({}), contentWrap.record);
    }
}

async function add(
    article: Omit<ArticleIndex, 'id' | 'createTime' | 'updateTime'>,
    base: ArticleBase,
    content: string): Promise<number> {
    const now = new Date();
    const id = now.getTime();
    // 获取列表
    const res = await listByAsync<ArticleIndex>(LocalNameEnum.ARTICLE);
    // 新增索引
    res.list.push(getDefaultArticleIndex({
        ...article,
        createTime: now,
        updateTime: now,
        id,
    }));
    // 保存
    await saveListByAsync<ArticleIndex>(LocalNameEnum.ARTICLE, res.list, res.rev);
    // 新增基础信息
    await saveOneByAsync(
        LocalNameEnum.ARTICLE_BASE + id,
        toRaw(base)
    )
    // 新增内容
    await saveOneByAsync(
        LocalNameEnum.ARTICLE_CONTENT + id,
        {
            content
        } as ArticleContent
    );
    return Promise.resolve(id);
}
