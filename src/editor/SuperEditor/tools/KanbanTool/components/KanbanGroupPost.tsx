import {buildKanbanGroup, IKanbanInstance, KanbanDataGroup} from "@/editor/SuperEditor/tools/KanbanTool/types";
import {ColorPicker, DialogPlugin, Form, FormItem, Input} from "tdesign-vue-next";
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {clone} from "radash";

export function postGroup(old?: KanbanDataGroup, instance?: IKanbanInstance) {
  if (!instance) return MessageUtil.error("看板实例不存在");
  const form = ref(old ? clone(old) : buildKanbanGroup());
  const action = old ? '修改' : '新增';
  const dialog = DialogPlugin({
    header: action + '分组',
    placement: 'center',
    draggable: true,
    default: () => <Form data={form.value}>
      <FormItem label={'颜色'} labelAlign={'top'}>
        <ColorPicker v-model={form.value.color} recentColors={false} swatchColors={[]}/>
      </FormItem>
      <FormItem label={'名称'} labelAlign={'top'}>
        <Input v-model={form.value.name}/>
      </FormItem>
    </Form>,
    confirmBtn: {
      default: action
    },
    onConfirm: () => {
      try {
        if (old) {
          instance.updateGroup(old.id, form.value.name, form.value.color);
        } else {
          instance.addGroup(form.value.name, form.value.color);
        }
        MessageUtil.success(action + "成功");
        dialog.destroy();
      } catch (e) {
        MessageUtil.error("修改失败", e);
      }
    }
  })
}

export function deleteGroup(groupId: string, instance?: IKanbanInstance) {
  if (!instance) return MessageUtil.error("看板实例不存在");
  MessageBoxUtil.confirm("你是否要删除分组，删除后将无法使用", "删除分组", {
    confirmButtonText: "删除"
  }).then(() => {
    instance.deleteGroup(groupId);
  })
}