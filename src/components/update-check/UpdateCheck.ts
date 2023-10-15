import LocalNameEnum from "@/enumeration/LocalNameEnum";
import Constant from "@/global/Constant";
import NotificationUtil from "@/utils/NotificationUtil";
import {useAuthStore} from "@/store/components/AuthStore";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/MessageUtil";
import {getFromOneByAsync, listByAsync, saveListByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {ArticleBase, ArticleIndex, getDefaultArticleBase} from "@/entity/article";
import {init} from "@/components/update-check/init";

export default function updateCheck(toUpdate?: () => void) {
    useAuthStore().authDriver.get(LocalNameEnum.VERSION)
        .then(res => {
            if (res) {
                if (res.value !== Constant.version) {
                    useAuthStore().authDriver.put({
                        _id: LocalNameEnum.VERSION,
                        _rev: res._rev,
                        value: Constant.version
                    }).then(() => console.log("版本更新"));
                    toUpdate && toUpdate();

                    const oldVersion = parseVersion(res.value);
                    const newVersion = parseVersion(Constant.version);

                    if (oldVersion.main <= 1 && oldVersion.sub <= 3) {
                        if (newVersion.main > 1  || (newVersion.main == 1 && oldVersion.sub >=3)) {
                            // 执行
                            updateTo130FromUnder();
                        }
                    }

                }
            } else {
                // 第一次
                NotificationUtil.success("欢迎您使用知识库");
                useAuthStore().authDriver.put({
                    _id: LocalNameEnum.VERSION,
                    value: Constant.version
                }).then(() => console.log("版本更新"));
                init();
            }
        })
}

interface Version {
    main: number;
    sub: number;
    dot: number;
}

function parseVersion(str: string): Version {
    try {
        if (str) {
            const split = str.split('.');
            return {
                main: parseInt(split[0]),
                sub: parseInt(split[0]),
                dot: parseInt(split[0])
            }
        }
        return {
            main: 0,
            sub: 0,
            dot: 0
        }
    }catch (e){
        console.error("版本解析失败", e);
        return {
            main: 0,
            sub: 0,
            dot: 0
        }
    }
}

// 更新到1.3.0需要做数据迁移
function updateTo130FromUnder() {
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
        const base = await getFromOneByAsync<ArticleBase>(LocalNameEnum.ARTICLE_BASE + articleIndex.id, getDefaultArticleBase());
        await saveOneByAsync<ArticleBase>(LocalNameEnum.ARTICLE_BASE + articleIndex.id, {
            ...base.record,
            // @ts-ignore
            tags: articleIndex.tags,
            // @ts-ignore
            source: articleIndex.source,
            // @ts-ignore
            description: articleIndex.description
        }, base.rev);
        // 删除原有属性
        results.push({
            id: articleIndex.id,
            createTime: articleIndex.createTime,
            updateTime: articleIndex.updateTime,
            name: articleIndex.name,
            categoryId: articleIndex.categoryId,
            folder: articleIndex.folder,
            preview: articleIndex.preview,
            type: articleIndex.type
        })
    }
    // 更新
    await saveListByAsync<ArticleIndex>(LocalNameEnum.ARTICLE, results, res.rev);
    // 初始化数据
    init();
}

