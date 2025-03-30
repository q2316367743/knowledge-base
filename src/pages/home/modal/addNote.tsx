import {ChatMessage} from "@/types/Chat";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {useFolderStore} from "@/store/db/FolderStore";
import {DialogPlugin, Form, FormItem, Input, Switch, TreeSelect} from "tdesign-vue-next";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {isNotEmptyString} from "@/utils/lang/FieldUtil";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {addNote} from "@/utils/component/AddNoteUtil";

export function addNoteFromAi(message: ChatMessage, onSuccess: () => void) {
  const {folderTree} = useFolderStore();
  const folder = ref(0);
  const name = ref(message.q);
  const hasThink = isNotEmptyString(message.t);
  const saveThink = useUtoolsDbStorage<boolean>(LocalNameEnum.KEY_HOME_SAVE_THINK, true);

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
      {hasThink && <FormItem label={'保存思考过程'} labelAlign={'top'}>
        <Switch v-model={saveThink.value}/>
      </FormItem>}
    </Form>,
    async onConfirm() {
      if (name.value.trim() === '') {
        MessageUtil.warning("请输入笔记名称")
        return false;
      }
      let content = "";
      if (hasThink && saveThink.value) {
        content += message.t.split("\n").map((e => `> ${e}`)).join("\n");
        content += "\n\n";
      }
      content += message.a;
      try {
        const article = await addNote({
          name: name.value,
          pid: folder.value,
          type: ArticleTypeEnum.MARKDOWN,
          content,
          extra: {
            preview: true
          }
        });
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