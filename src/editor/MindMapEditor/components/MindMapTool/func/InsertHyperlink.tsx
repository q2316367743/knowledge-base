import {MindMapNode} from "@/editor/MindMapEditor/domain";
import {Form, FormItem, Input, DialogPlugin} from "tdesign-vue-next";

export function openInsertHyperlink(activeNodes: MindMapNode[]) {
  if (activeNodes.length === 0) {
    return;
  }
  const first = activeNodes[0];
  const data = ref({
    url: first.getData('hyperlink') || '',
    title: first.getData('hyperlinkTitle') || ''
  });
  const p = DialogPlugin({
    header: "超链接",
    draggable: true,
    placement: 'center',
    default: () => <Form data={data.value}>
      <FormItem label={'地址'} labelAlign={'top'}>
        <Input v-model={data.value.url}/>
      </FormItem>
      <FormItem label={'标题'} labelAlign={'top'}>
        <Input v-model={data.value.title}/>
      </FormItem>
    </Form>,
    onConfirm() {
      activeNodes.forEach(activeNode => {
        activeNode.setHyperlink(data.value.url, data.value.title);
      });
      p.destroy();
    }
  });
}
