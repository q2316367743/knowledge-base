import Cherry from "cherry-markdown";
import {ref, ShallowRef} from "vue";
import {Modal, Option, Select} from "@arco-design/web-vue";
import {useArticleStore} from "@/store/db/ArticleStore";

export const useRelationMenu = (editor: ShallowRef<Cherry | undefined>) => {
    return Cherry.createMenuHook('引用', {
        onClick: () => {
            const articleIndexes = useArticleStore().articles;
            const articleId = ref<number>();
            const modalReturn = Modal.open({
                title: '请选择笔记',
                content: () => <Select v-model={articleId.value} allowSearch allowClear>
                    {articleIndexes.map(index => <Option value={index.id}>{index.name}</Option>)}
                </Select>,
                onOk() {
                    if (articleId.value) {
                        const articleIndex = useArticleStore().articleMap.get(articleId.value);
                        if (articleIndex) {
                            insert(articleIndex.name);
                        }
                    }
                }
            });


            function insert(title: string) {
                editor.value && editor.value.insertValue(`[[${title}]]`);
                modalReturn.close();
            }

        }
    });
}
