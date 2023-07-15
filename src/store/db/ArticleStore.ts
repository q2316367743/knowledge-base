import {defineStore} from "pinia";
import {ArticleIndex} from "@/entity/article";

export const useArticleStore = defineStore('article', {
    state: () => ({
        articles: new Array<ArticleIndex>()
    }),

});
