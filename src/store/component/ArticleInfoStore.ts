import {defineStore} from "pinia";

export const useArticleInfoStore = defineStore('article-info', {
    state: () => ({
        id: 0,
        title: ''
    }),
    actions: {
        init(id: number, title: string) {
            this.id = id;
            this.title = title;
        }
    }
})
