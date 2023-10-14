import {defineStore} from "pinia";
import {
    ArticleBase,
    ArticleIndex,
    ArticleSource,
    getDefaultArticleBase,
    getDefaultArticleIndex
} from "@/entity/article";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {group, map} from "@/utils/ArrayUtil";
import {toRaw} from "vue";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import {useAuthStore} from "@/store/components/AuthStore";
import {listByAsync, removeOneByAsync, saveListByAsync, saveOneByAsync} from "@/utils/utools/DbStorageUtil";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";

export const useArticleStore = defineStore('article', {
    state: () => ({
        value: new Array<ArticleIndex>(),
        rev: undefined as string | undefined
    }),
    getters: {
        articles: state => state.value.sort((a, b) => b.id - a.id),
        articleMap: (state): Map<number, ArticleIndex> => map(state.value, 'id'),
        categoryMap: (state): Map<number | null, Array<ArticleIndex>> => {
            const articles = state.value.sort((a, b) => a.name.localeCompare(b.name));
            return group(articles, 'categoryId')
        },
        folderMap: (state): Map<number, Array<ArticleIndex>> => {
            const articles = state.value.sort((a, b) => a.name.localeCompare(b.name));
            return group<ArticleIndex, 'folder', number>(articles, 'folder')
        },
        articleNames: (state): Set<string> => {
            const names = new Set<string>();
            for (let item of state.value) {
                names.add(item.name);
            }
            return names;
        }
    },
    actions: {
        async init() {
            const res = await listByAsync<ArticleIndex>(LocalNameEnum.ARTICLE);
            this.value = res.list;
            this.rev = res.rev
        },
        async _sync() {
            this.rev = await saveListByAsync(LocalNameEnum.ARTICLE, this.value);
        },
        addSimple(content: string, title?: string): Promise<number> {
            return this.add(getDefaultArticleIndex({
                name: title || ('导入文章' + new Date().getTime()),
            }), getDefaultArticleBase({source: "快捷导入"}), content);
        },
        async add(
            article: Omit<ArticleIndex, 'id' | 'createTime' | 'updateTime'>,
            base: ArticleBase,
            content: string): Promise<number> {
            // 校验
            if (article.name.trim() === '') {
                return Promise.reject("文章标题不能为空");
            }
            if (this.articleNames.has(article.name)) {
                return Promise.reject("文章标题已存在，请重新输入！");
            }
            const now = new Date();
            const id = now.getTime();
            // 新增索引
            this.value.push({
                id,
                createTime: now,
                updateTime: now,
                name: article.name,
                categoryId: article.categoryId,
                folder: article.folder,
                preview: article.preview,
                type: article.type
            });
            await this._sync();
            // 新增基础信息
            const baseRes = await useAuthStore().authDriver.put({
                _id: LocalNameEnum.ARTICLE_BASE + id,
                value: toRaw(base)
            })
            if (baseRes.error) {
                // 删除索引
                this.value.pop();
                await this._sync();
                return Promise.reject("新增基础信息异常，" + baseRes.error);
            }
            // 新增内容
            const contentRes = await useAuthStore().authDriver.put({
                _id: LocalNameEnum.ARTICLE_CONTENT + id,
                value: {
                    content
                } as ArticleSource
            });
            if (contentRes.error) {
                // 删除索引
                this.value.pop();
                await this._sync();
                // 删除基础信息
                await removeOneByAsync(LocalNameEnum.ARTICLE_BASE + id, true);
                return Promise.reject("新增内容异常，" + contentRes.error);
            }
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
            // 校验
            if (typeof article.name != 'undefined') {
                if (article.name.trim() === '') {
                    return Promise.reject("文章标题不能为空");
                }
            }
            // 新增索引
            this.value[index] = {
                ...this.value[index],
                ...article,
                updateTime: new Date(),
            };

            await this._sync();
        },
        async update(
            id: number,
            article: Partial<ArticleIndex>,
            base: ArticleBase,
            content: string
        ) {
            await this.updateIndex(id, article);
            // 删除旧的基础信息
            await removeOneByAsync(LocalNameEnum.ARTICLE_BASE + id, true);
            // 新增基础信息
            const baseRes = await useAuthStore().authDriver.put({
                _id: LocalNameEnum.ARTICLE_BASE + id,
                value: toRaw(base)
            })
            if (baseRes.error) {
                // 删除索引
                this.value.pop();
                await this._sync();
                return Promise.reject("修改基础信息异常，" + baseRes.error);
            }
            // 删除旧的内容
            await removeOneByAsync(LocalNameEnum.ARTICLE_CONTENT + id, true);
            // 新增内容
            const contentRes = await useAuthStore().authDriver.put({
                _id: LocalNameEnum.ARTICLE_CONTENT + id,
                value: {
                    content
                } as ArticleSource
            });
            if (contentRes.error) {
                // 删除索引
                return Promise.reject("修改内容异常，" + contentRes.error);
            }
        },
        async updateContent(
            id: number,
            article: Partial<ArticleIndex>,
            content: string,
            rev: undefined | string
        ): Promise<undefined | string> {
            await this.updateIndex(id, article);
            // 新增内容
            return saveOneByAsync<ArticleSource>(LocalNameEnum.ARTICLE_CONTENT + id, {
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
            return saveOneByAsync<ArticleBase>(LocalNameEnum.ARTICLE_BASE + useHomeEditorStore().id, base, rev);
        },
        async removeById(id: number) {
            const index = this.value.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("动态未找到，请刷新后重试！");
            }
            // 删除索引
            this.value.splice(index, 1);
            await this._sync();
            // 删除内容
            await removeOneByAsync(LocalNameEnum.ARTICLE_CONTENT + id, true);
            await removeOneByAsync(LocalNameEnum.ARTICLE_PREVIEW + id, true);
            // 删除评论
            await removeOneByAsync(LocalNameEnum.ARTICLE_COMMENT + id, true);
            // TODO: 删除附件
            // 如果当前就是这个文章，则清除
            if (id === useHomeEditorStore().id) {
                useHomeEditorStore().setId(0);
            }
        },
        async drop(id: number, pid: number) {
            const index = this.value.findIndex(e => e.id === id);
            if (index === -1) {
                return Promise.reject("动态未找到，请刷新后重试！");
            }
            this.value[index] = {
                ...this.value[index],
                folder: pid,
                updateTime: new Date(),
            }
            // 同步
            await this._sync();
        },
    }
});
