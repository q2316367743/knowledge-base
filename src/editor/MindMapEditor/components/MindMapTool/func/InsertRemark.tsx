import {MindMapNode} from "@/editor/MindMapEditor/domain";
import {DialogPlugin, Textarea} from "tdesign-vue-next";

export function openInsertRemark(activeNodes: MindMapNode[]) {

  if (activeNodes.length === 0) {
    return;
  }
  const first = activeNodes[0];
  const data = ref({
    note: first.getData('note') || ''
  });
  const p = DialogPlugin({
    header: "备注",
    placement: 'center',
    draggable: true,
    default: () => <Textarea autosize={{minRows: 2, maxRows: 8}} v-model={data.value.note}
                             placeholder={"请输入备注内容"}/>,
    onConfirm() {
      activeNodes.forEach(activeNode => {
        activeNode.setNote(data.value.note);
      });
      p.destroy();
    }
  });
}
