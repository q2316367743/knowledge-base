// 更新到1.3.0需要做数据迁移
import MessageUtil from "@/utils/MessageUtil";
import {useGlobalStore} from "@/store/GlobalStore";
import {getFromOneWithDefaultByAsync, listByAsync, saveListByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {ArticleBase, ArticleIndex, getDefaultArticleBase} from "@/entity/article";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {init} from "@/components/update-check/record/init";

export function updateTo130FromUnder() {
    useGlobalStore().startLoading("数据开始迁移");
    _updateTo130FromUnder()
        .then(() => MessageUtil.success("数据迁移完成"))
        .catch(e => MessageUtil.error("数据迁移失败", e))
        .finally(() => useGlobalStore().closeLoading());
}

async function _updateTo130FromUnder() {
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
