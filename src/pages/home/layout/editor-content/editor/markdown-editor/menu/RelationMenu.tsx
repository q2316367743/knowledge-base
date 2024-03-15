import Cherry from "cherry-markdown";
import {useArticleStore} from "@/store/db/ArticleStore";
import {ShallowRef} from "vue";

export const useRelationMenu = (editor: ShallowRef<Cherry | undefined>) => {
    return Cherry.createMenuHook('引用', {
        subMenuConfig: useArticleStore().articles.map(e => ({
            name: e.name,
            onclick: () => {
                editor.value && editor.value.insertValue(`[[${e.name}]]`)
            }
        }))
    });
}
