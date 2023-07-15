import {defineStore} from "pinia";
import {ArticleIndex} from "@/entity/article";
import {utools} from "@/plugin/utools";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {map} from "@/utils/ArrayUtil";

export const useArticleStore = defineStore('article', {
    state: () => ({
        value: new Array<ArticleIndex>(),
        rev: undefined as string | undefined
    }),
    getters: {
        articles: state => state.value.sort((a, b) => a.name.localeCompare(b.name)),
        categoryMap: state => {
            const articles = state.value.sort((a, b) => a.name.localeCompare(b.name));
            return map(articles, 'categoryId')
        },
        articleTags: (state): Set<string> => {
            const tags = new Set<string>();
            for (let item of state.value) {
                for (let tag of item.tags) {
                    tags.add(tag);
                }
            }
            return tags;
        }
    },
    actions: {
        async init() {
            const res = await utools.db.promises.get(LocalNameEnum.ARTICLE);
            if (res) {
                this.value = res.value;
                this.rev = res._rev
            }
        }
    }
});
