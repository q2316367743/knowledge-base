import {DialogPlugin, Input} from "tdesign-vue-next";
import {useAiChatGroupStore} from "@/store/ai/AiChatGroupStore";
import MessageUtil from "@/utils/modal/MessageUtil";

export function openAddAiChatGroupDialog() {
  const name = ref('');
  const dp = DialogPlugin({
    header: "创建分组",
    closeBtn: true,
    placement: "center",
    draggable: true,
    confirmBtn: '创建',
    width: '450px',
    default: () => <div>
      <Input v-model={name.value} autofocus={true} placeholder={'请输入分组名称'} maxlength={8} showLimitNumber={true}/>
      <div style={{
        color: 'var(--td-text-color-secondary)',
        marginTop: '16px',
        fontSize: 'var(--td-font-size-body-medium)'
      }}>什么是分组？</div>
      <div
        style={{color: 'var(--td-text-color-placeholder)', marginTop: '8px'}}>分组功能支持对话分类管理，并通过专属指令定制回复，使交流更专注、个性化且持续发展。
      </div>
    </div>,
    onConfirm() {
      useAiChatGroupStore().add({
        name: name.value,
        prompt: ''
      }).then(() => {
        dp.destroy();
        MessageUtil.success("新增成功！");
      }).catch(e => {
        MessageUtil.error("新增失败！", e);
      })
    }
  })
}