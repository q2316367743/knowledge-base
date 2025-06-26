import {MindMapNode} from "@/editor/MindMapEditor/domain";
import {DialogPlugin, Textarea} from "tdesign-vue-next";
import RichEditor from '@/editor/RichTextEditor/index.vue';

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
    width: 'fit-content',
    draggable: true,
    default: () => <div style={{
      minHeight: '300px',
      height: 'calc(100vh - 266px)',
      position: 'relative',
      minWidth: '600px',
      width: '80vw',
      maxWidth: '1200px'
    }}>
      <RichEditor v-model={data.value.note}/>
    </div>,
    onConfirm() {
      activeNodes.forEach(activeNode => {
        activeNode.setNote(data.value.note);
      });
      p.destroy();
    }
  });
}
