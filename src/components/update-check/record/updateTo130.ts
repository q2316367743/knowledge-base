// 更新到1.3.0需要做数据迁移
import {getFromOneWithDefaultByAsync, listByAsync, saveListByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {ArticleBase, ArticleIndex, getDefaultArticleBase} from "@/entity/article";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {init} from "@/components/update-check/record/init";


export async function updateTo130FromUnder() {
    // 获取全部的文章
    const res = await listByAsync<ArticleIndex>(LocalNameEnum.ARTICLE);
    let records = res.list;
    let results = new Array<ArticleIndex>();
    for (let articleIndex of records) {
        // 把属性加入
        const base = await getFromOneWithDefaultByAsync<ArticleBase>(LocalNameEnum.ARTICLE_BASE + articleIndex.id, getDefaultArticleBase());
        const baseNew: ArticleBase = {
            ...base.record,
            // @ts-ignore
            tags: articleIndex.tags,
            // @ts-ignore
            source: articleIndex.source,
            // @ts-ignore
            description: articleIndex.description
        };
        await saveOneByAsync<ArticleBase>(LocalNameEnum.ARTICLE_BASE + articleIndex.id, baseNew, base.rev);
        // 删除原有属性
        results.push({
            id: articleIndex.id,
            createTime: articleIndex.createTime,
            updateTime: articleIndex.updateTime,
            name: articleIndex.name,
            categoryId: articleIndex.categoryId,
            folder: articleIndex.folder,
            preview: articleIndex.preview,
            type: articleIndex.type,
            isDelete: false
        })
    }
    // 更新
    await saveListByAsync<ArticleIndex>(LocalNameEnum.ARTICLE, results, res.rev);
    // 初始化数据
    init();
}
