import {defineStore} from "pinia";
import {
    ArticleBase,
    ArticleIndex,
    getDefaultArticleBase,
    getDefaultArticleIndex
} from "@/entity/article";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {group, map} from "@/utils/ArrayUtil";
import {toRaw} from "vue";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {listByAsync, removeOneByAsync, saveListByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {ArticleContent} from "@/entity/article/ArticleContent";

let isInit = false;

export const useArticleStore = defineStore('article', {
    state: () => ({
        value: new Array<ArticleIndex>(),
        rev: undefined as string | undefined
    }),
    getters: {
        articles: state => state.value.filter(e => !e.isDelete).sort((a, b) => b.id - a.id),
        articleDeletes: state => state.value.filter(e => e.isDelete),
        articleMap: (state): Map<number, ArticleIndex> =>
            map(state.value.filter(e => !e.isDelete), 'id'),
        categoryMap: (state): Map<number | null, Array<ArticleIndex>> => {
            const articles = state.value.filter(e => !e.isDelete).sort((a, b) => a.name.localeCompare(b.name));
            // @ts-ignore
            return group(articles, 'categoryId')
        },
        folderMap: (state): Map<number, Array<ArticleIndex>> => {
            const articles = state.value.filter(e => !e.isDelete).sort((a, b) => a.name.localeCompare(b.name));
            return group(articles, 'folder')
        },
        articleNames: (state): Set<string> => {
            const names = new Set<string>();
            for (let item of state.value.filter(e => !e.isDelete)) {
                names.add(item.name);
            }
            return names;
        }
    },
    actions: {
        async init(force: boolean = false): Promise<Array<ArticleIndex>> {
            if (isInit && !force) {
                return this.value;
            }
            const res = await listByAsync<ArticleIndex>(LocalNameEnum.ARTICLE);
            this.value = res.list;
            this.rev = res.rev;
            isInit = true;
            return this.value;
        },
        async _sync() {
            this.rev = await saveListByAsync(LocalNameEnum.ARTICLE, this.value, this.rev);
        },
        addSimple(content: string, title?: string): Promise<number> {
            return this.add(getDefaultArticleIndex({
                name: title || ('导入文章' + new Date().getTime()),
            }), getDefaultArticleBase({source: "快捷导入"}), content);
        },
        async add(
            article: Omit<ArticleIndex, 'id' | 'createTime' | 'updateTime'>,
            base: ArticleBase,
            content: any): Promise<number> {
            // 校验
            if (article.name.trim() === '') {
                return Promise.reject("文章标题不能为空");
            }
            if (this.articleNames.has(article.name)) {
                return Promise.reject("文章标题已存在，请重新输入！");
            }
            const now = new Date();
            const id = now.getTime();

            // 新增内容
            await saveOneByAsync(
                LocalNameEnum.ARTICLE_CONTENT + id,
                {
                    content
                } as ArticleContent
            );

            // 新增基础信息
            await saveOneByAsync(
                LocalNameEnum.ARTICLE_BASE + id,
                toRaw(base)
            )

            // 新增索引
            this.value.push(getDefaultArticleIndex({
                ...article,
                createTime: now,
                updateTime: now,
                id,
            }));
            await this._sync();
            return Promise.resolve(id);
        },
        async updateIndex(
            id: number,
            article: Partial<ArticleIndex>
        ) {
            const index = this.value.findIndex(e => e.id === id);
            if (index === -1) {
                await MessageBoxUtil.confirm("文章未找到，是否新增文章", "更新失败", {
                    confirmButtonText: "新增",
                    cancelButtonText: "取消"
                });
                await this.add(Object.assign(getDefaultArticleIndex(), article), getDefaultArticleBase(), "");
                return Promise.resolve();
            }
            // 新增索引
            this.value[index] = {
                ...this.value[index],
                ...article,
                updateTime: new Date(),
            };

            await this._sync();
        },
        async updateMultiIndex(
            articles: Array<Pick<ArticleIndex, 'id'> & Partial<ArticleIndex>>
        ) {
            for (let article of articles) {
                const index = this.value.findIndex(e => e.id === article.id);
                if (index === -1) {
                    continue;
                }
                // 新增索引
                this.value[index] = {
                    ...this.value[index],
                    ...article,
                    updateTime: new Date(),
                };
            }

            await this._sync();
        },
        async updateContent(
            id: number,
            content: string,
            rev?: undefined | string,
            article?: Partial<ArticleIndex>,
        ): Promise<undefined | string> {
            await this.updateIndex(id, article || {});
            // 新增内容
            return saveOneByAsync<ArticleContent>(LocalNameEnum.ARTICLE_CONTENT + id, {
                content
            }, rev);
        },
        async updateBase(
            id: number,
            article: Partial<ArticleIndex>,
            base: ArticleBase,
            rev: undefined | string
        ): Promise<string | undefined> {
            await this.updateIndex(id, article);
            return saveOneByAsync<ArticleBase>(LocalNameEnum.ARTICLE_BASE + id, base, rev);
        },
        async removeRealById(id: number) {
            const index = this.value.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("动态未找到，请刷新后重试！");
            }
            // 删除索引
            this.value.splice(index, 1);
            await this._sync();
            // 删除内容
            await removeOneByAsync(LocalNameEnum.ARTICLE_CONTENT + id, true);
            // 删除评论
            await removeOneByAsync(LocalNameEnum.ARTICLE_COMMENT + id, true);
            // 如果当前就是这个文章，则清除
            useHomeEditorStore().closeArticle(id);
        },
        async removeRealByIds(ids: Array<number>) {
            this.value = this.value.filter(e => ids.indexOf(e.id) === -1);
            // 删除索引
            await this._sync();
            for (let id of ids) {
                // 删除基础信息
                await removeOneByAsync(LocalNameEnum.ARTICLE_BASE + id, true);
                // 删除内容
                await removeOneByAsync(LocalNameEnum.ARTICLE_CONTENT + id, true);
                // 删除评论
                await removeOneByAsync(LocalNameEnum.ARTICLE_COMMENT + id, true);
            }
            // 如果当前就是这个文章，则清除
            useHomeEditorStore().closeArticle(...ids);
        },
        async drop(id: number, pid: number) {
            const index = this.value.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("笔记未找到，请刷新后重试！");
            }
            this.value[index] = {
                ...this.value[index],
                folder: pid,
                updateTime: new Date(),
            }
            // 同步
            await this._sync();
        },
        async removeById(id: number) {
            await this.updateIndex(id, {
                isDelete: true
            });
            useHomeEditorStore().closeArticle(id);
            return Promise.resolve();
        },
        async removeBatchByIds(ids: Array<number>) {
            await this.updateMultiIndex(ids.map(id => ({
                id: id,
                isDelete: true
            })));
            // 如果当前就是这个文章，则清除
            useHomeEditorStore().closeArticle(...ids);
            return Promise.resolve();
        },
        async removeFolder(folderId: number) {
            let articleIndices = this.folderMap.get(folderId);
            if (!articleIndices) {
                return ;
            }
            await this.updateMultiIndex(articleIndices.map(e => ({
                id: e.id,
                isDelete: true
            })));
            useHomeEditorStore().closeArticle(...articleIndices.map(e => e.id));
            return Promise.resolve();
        },
    }
});
