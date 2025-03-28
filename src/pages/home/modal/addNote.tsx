import {ChatMessage} from "@/types/Chat";
import {ref} from "vue";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {useFolderStore} from "@/store/db/FolderStore";
import {DialogPlugin,Form, FormItem, Input, TreeSelect} from "tdesign-vue-next";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";

export function addNoteFromAi(message: ChatMessage, onSuccess: () => void) {
  const {folderTree} = useFolderStore();
  const folder = ref(0);
  const name = ref(message.q);

  const plugin = DialogPlugin({
    header: '新增笔记',
    draggable: true,
    placement: 'center',
    confirmBtn: '新增',
    default: () => <Form data={{}} layout={'vertical'}>
      <FormItem label={'所在文件夹'} labelAlign={'top'}>
        <TreeSelect data={folderTree} v-model={folder.value} placeholder={'请选择所在文件夹'}/>
      </FormItem>
      <FormItem label={'笔记名称'} labelAlign={'top'}>
        <Input v-model={name.value} class={'arco-input'} placeholder={'请输入笔记名称'} clearable={true}/>
      </FormItem>
    </Form>,
    async onConfirm() {
      if (name.value.trim() === '') {
        MessageUtil.warning("请输入笔记名称")
        return false;
      }
      try {
        const article = await useArticleStore().add(getDefaultArticleIndex({
          name: name.value,
          folder: folder.value,
          type: ArticleTypeEnum.MARKDOWN,
          preview: true
        }), getDefaultArticleBase(), message.a);
        useHomeEditorStore().openArticle(article);
        // 跳转
        onSuccess();
        plugin.destroy();
        return true;
      } catch (e) {
        MessageUtil.warning("新增笔记出错", e);
        return false;
      }
    }
  })
}