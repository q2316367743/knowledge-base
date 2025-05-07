import {clone} from "radash";
import {DialogPlugin, Form, FormItem, Input} from 'tdesign-vue-next';
import {buildKanbanNode, IKanbanInstance, KanbanDataNode} from "@/editor/SuperEditor/block/KanbanTool/types";
import RichTextEditor from '@/editor/RichTextEditor/index.vue';
import MessageUtil from "@/utils/modal/MessageUtil";

export function openKanbanNodePost(groupId: string, old?: KanbanDataNode, instance?: IKanbanInstance, index?: number) {
  const node = ref<KanbanDataNode>(old ? clone(old) : buildKanbanNode());

  const plugin = DialogPlugin({
    header: '新增记录',
    placement: 'center',
    draggable: true,
    closeOnEscKeydown: false,
    closeOnOverlayClick: false,
    width: 650,
    default: () => <Form data={node.value}>
      <FormItem label={'记录'} labelAlign={'top'} requiredMark={true}>
        <Input v-model={node.value.name} autofocus={true}/>
      </FormItem>
      <FormItem label={'备注'} labelAlign={'top'}>
        <div class={'h-250px'}>
          <RichTextEditor v-model={node.value.content} simple={true}/>
        </div>
      </FormItem>
    </Form>,
    onConfirm: () => {
      if (!instance) {
        return MessageUtil.error("系统异常，核心注入器不存在");
      }
      try {
        instance.postNode(groupId, node.value, index)
        MessageUtil.success((old ? "修改" : "新增") + "成功");
        plugin.destroy();
      } catch (e) {
        MessageUtil.error((old ? "修改" : "新增") + "失败", e)
      }
    },
  })
}