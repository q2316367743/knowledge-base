import Cherry from "cherry-markdown";
import {DialogPlugin, Option, Select} from "tdesign-vue-next";
import {useArticleStore} from "@/store/db/ArticleStore";
import {ShallowRef} from "vue";

export const useRelationMenu = (editor: ShallowRef<Cherry | undefined>) => {
  return Cherry.createMenuHook('引用', {
    onClick: () => {
      const articleIndexes = useArticleStore().articles;
      const articleId = ref<number>();
      const modalReturn = DialogPlugin({
        header: '请选择笔记',
        default: () => <Select v-model={articleId.value} allowSearch allowClear>
          {articleIndexes.map(index => <Option value={index.id} label={index.name}>{index.name}</Option>)}
        </Select>,
        onConfirm() {
          if (articleId.value) {
            const articleIndex = useArticleStore().articleMap.get(articleId.value);
            if (articleIndex) {
              insert(articleIndex.name);
            }
          }
          modalReturn.destroy();
        }
      });


      function insert(title: string) {
        editor.value && editor.value.insertValue(`[[${title}]]`);
        modalReturn.close();
      }

    }
  });
}
