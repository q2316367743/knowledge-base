import {defineStore} from "pinia";
import {ArticleBase, ArticleIndex, ArticlePreview, ArticleSource} from "@/entity/article";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {group, map} from "@/utils/ArrayUtil";
import {toRaw} from "vue";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import md from "@/plugin/markdown";
import {useAuthStore} from "@/store/components/AuthStore";

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
        articleTags: (state): Set<string> => {
            const tags = new Set<string>();
            for (let item of state.value) {
                for (let tag of item.tags) {
                    tags.add(tag);
                }
            }
            return tags;
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
            const res = await useAuthStore().authDriver.get(LocalNameEnum.ARTICLE);
            if (res) {
                this.value = res.value;
                this.rev = res._rev
            } else {
                this.value = new Array<ArticleIndex>();
                this.rev = undefined;
            }
        },
        async _sync() {
            const res = await useAuthStore().authDriver.put({
                _id: LocalNameEnum.ARTICLE,
                _rev: this.rev,
                value: toRaw(this.articles)
            });
            if (res.error) {
                return Promise.reject(res.message);
            }
            this.rev = res.rev;
        },
        async add(
            article: Pick<ArticleIndex, 'name' | 'categoryId' | 'tags' | 'description' | 'source'>,
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
                description: article.description,
                categoryId: article.categoryId,
                tags: toRaw(article.tags),
                source: article.source
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
                await useAuthStore().authDriver.remove(LocalNameEnum.ARTICLE_BASE + id);
                return Promise.reject("新增内容异常，" + contentRes.error);
            }
            // 新增预览
            let preview = md.render(content);
            const previewRes = await useAuthStore().authDriver.put({
                _id: LocalNameEnum.ARTICLE_PREVIEW + id,
                value: {
                    html: preview,
                    toc: ''
                } as ArticlePreview
            });
            if (previewRes.error) {
                // 删除索引
                this.value.pop();
                await this._sync();
                // 删除基础信息
                await useAuthStore().authDriver.remove(LocalNameEnum.ARTICLE_BASE + id);
                // 删除内容
                await useAuthStore().authDriver.remove(LocalNameEnum.ARTICLE_CONTENT + id);
                return Promise.reject("新增预览异常，" + previewRes.error);
            }
            return Promise.resolve(id);
        },
        async update(
            id: number,
            article: Pick<ArticleIndex, 'name' | 'categoryId' | 'tags' | 'description' | 'createTime' | 'source'>,
            base: ArticleBase,
            content: string
        ) {
            const index = this.value.findIndex(e => e.id === id);
            if (index === -1) {
                await MessageBoxUtil.confirm("文章未找到，是否新增文章", "更新失败", {
                    confirmButtonText: "新增",
                    cancelButtonText: "取消"
                });
                await this.add(article, base, content);
                return Promise.resolve();
            }
            // 校验
            if (article.name.trim() === '') {
                return Promise.reject("文章标题不能为空");
            }
            // 新增索引
            this.value[index] = {
                ...this.value[index],
                ...article,
                updateTime: new Date(),
                tags: toRaw(article.tags),
            };

            await this._sync();
            // 删除旧的基础信息
            await useAuthStore().authDriver.remove(LocalNameEnum.ARTICLE_BASE + id);
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
            await useAuthStore().authDriver.remove(LocalNameEnum.ARTICLE_CONTENT + id);
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
            // 删除旧的预览
            await useAuthStore().authDriver.remove(LocalNameEnum.ARTICLE_PREVIEW + id);
            // 新增预览
            let preview = md.render(content);
            const previewRes = await useAuthStore().authDriver.put({
                _id: LocalNameEnum.ARTICLE_PREVIEW + id,
                value: {
                    html: preview,
                    toc: ''
                } as ArticlePreview
            });
            if (previewRes.error) {
                // 删除索引
                return Promise.reject("修改预览异常，" + contentRes.error);
            }
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
            await useAuthStore().authDriver.remove(LocalNameEnum.ARTICLE_CONTENT + id);
            await useAuthStore().authDriver.remove(LocalNameEnum.ARTICLE_PREVIEW + id);
            // 删除评论
            await useAuthStore().authDriver.remove(LocalNameEnum.ARTICLE_COMMENT + id);
            // 删除附件
        }
    }
});
