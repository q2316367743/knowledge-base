import {defineStore} from "pinia";
import {ArticleIndex, ArticlePreview, ArticleSource} from "@/entity/article";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {group, map} from "@/utils/ArrayUtil";
import {toRaw} from "vue";
import MessageUtil from "@/utils/MessageUtil";
import MessageBoxUtil from "@/utils/MessageBoxUtil";
import md from "@/plugin/markdown";

export const useArticleStore = defineStore('article', {
    state: () => ({
        value: new Array<ArticleIndex>(),
        rev: undefined as string | undefined
    }),
    getters: {
        articles: state => state.value.sort((a, b) => {
            const aTime = new Date(a.createTime);
            const bTime = new Date(b.createTime);
            a.createTime = aTime;
            b.createTime = bTime;
            return bTime.getTime() - aTime.getTime();
        }),
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
            const res = await utools.db.promises.get(LocalNameEnum.ARTICLE);
            if (res) {
                this.value = res.value;
                this.rev = res._rev
            }
        },
        async _sync() {
            const res = await utools.db.promises.put({
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
            base: Pick<ArticleIndex, 'name' | 'categoryId' | 'tags' | 'description' | 'source'>,
            content: string) {
            // 校验
            if (base.name.trim() === '') {
                return Promise.reject("文章标题不能为空");
            }
            if (this.articleNames.has(base.name)) {
                return Promise.reject("文章标题已存在，请重新输入！");
            }
            const now = new Date();
            const id = now.getTime();
            // 新增索引
            this.value.push({
                id,
                createTime: now,
                updateTime: now,
                name: base.name,
                description: base.description,
                categoryId: base.categoryId,
                tags: toRaw(base.tags),
                source: base.source
            });
            await this._sync();
            // 新增内容
            const contentRes = await utools.db.promises.put({
                _id: LocalNameEnum.ARTICLE_CONTENT + id,
                value: {
                    content
                } as ArticleSource
            });
            if (contentRes.error) {
                // 删除索引
                this.value.pop();
                await this._sync();
                return Promise.reject("新增内容异常，" + contentRes.error);
            }
            // 新增预览
            const previewRes = await utools.db.promises.put({
                _id: LocalNameEnum.ARTICLE_PREVIEW + id,
                value: {
                    html: md.render(content),
                    toc: []
                } as ArticlePreview
            });
            if (previewRes.error) {
                // 删除索引
                MessageUtil.warning("新增预览异常，" + previewRes.error);
            }
        },
        async update(
            id: number,
            base: Pick<ArticleIndex, 'name' | 'categoryId' | 'tags' | 'description' | 'createTime' | 'source'>,
            content: string
        ) {
            const index = this.value.findIndex(e => e.id === id);
            if (index === -1) {
                await MessageBoxUtil.confirm("文章未找到，是否新增文章", "更新失败", {
                    confirmButtonText: "新增",
                    cancelButtonText: "取消"
                });
                await this.add(base, content);
                return Promise.resolve();
            }
            // 校验
            if (base.name.trim() === '') {
                return Promise.reject("文章标题不能为空");
            }
            // 新增索引
            this.value[index] = {
                id,
                createTime: base.createTime,
                updateTime: new Date(),
                name: base.name,
                description: base.description,
                categoryId: base.categoryId,
                tags: toRaw(base.tags),
                source: base.source
            };

            await this._sync();
            // 删除旧的内容
            await utools.db.promises.remove(LocalNameEnum.ARTICLE_CONTENT + id);
            // 新增内容
            const contentRes = await utools.db.promises.put({
                _id: LocalNameEnum.ARTICLE_CONTENT + id,
                value: {
                    content
                } as ArticleSource
            });
            if (contentRes.error) {
                // 删除索引
                this.value.pop();
                await this._sync();
                return Promise.reject("新增内容异常，" + contentRes.error);
            }
            // 删除旧的预览
            await utools.db.promises.remove(LocalNameEnum.ARTICLE_PREVIEW + id);
            // 新增预览
            const previewRes = await utools.db.promises.put({
                _id: LocalNameEnum.ARTICLE_PREVIEW + id,
                value: {
                    html: md.render(content),
                    toc: []
                } as ArticlePreview
            });
            if (previewRes.error) {
                // 删除索引
                MessageUtil.warning("新增预览异常，" + previewRes.error);
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
            await utools.db.promises.remove(LocalNameEnum.ARTICLE_CONTENT + id);
            await utools.db.promises.remove(LocalNameEnum.ARTICLE_PREVIEW + id);
            // 删除评论
            // 删除附件
        }
    }
});
