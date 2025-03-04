import {ChatMessage} from "@/types/Chat";
import {ref} from "vue";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {useFolderStore} from "@/store/db/FolderStore";
import {Form, FormItem, Input, Modal, TreeSelect} from "@arco-design/web-vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getDefaultArticleBase, getDefaultArticleIndex} from "@/entity/article";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";

export function addNoteFromAi(message: ChatMessage, onSuccess: () => void) {
  const {folderTree} = useFolderStore();
  const folder = ref(0);
  const name = ref(message.q);

  Modal.open({
    title: '新增笔记',
    titleAlign: 'start',
    draggable: true,
    okText: '新增',
    content: () => <Form model={{}} layout={'vertical'}>
      <FormItem label={'所在文件夹'} required>
        <TreeSelect data={folderTree} v-model={folder.value} placeholder={'请选择所在文件夹'}/>
      </FormItem>
      <FormItem label={'笔记名称'} required>
        <Input v-model={name.value} class={'arco-input'} placeholder={'请输入笔记名称'} allowClear/>
      </FormItem>
    </Form>,
    async onBeforeOk() {
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
        return true;
      } catch (e) {
        MessageUtil.warning("新增笔记出错", e);
        return false;
      }
    }
  })
}