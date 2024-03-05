import {MindMapNode} from "@/pages/home/layout/editor-content/editor/MindMapEditor/domain";
import {ref} from "vue";
import {Modal, Textarea} from "@arco-design/web-vue";

export function openInsertRemark(activeNodes: MindMapNode[]) {

    if (activeNodes.length === 0) {
        return;
    }
    const first = activeNodes[0];
    const data = ref({
        note: first.getData('note') || ''
    });
    Modal.open({
        title: "备注",
        draggable: true,
        content: () => <Textarea autoSize={{minRows: 2, maxRows: 8}} v-model={data.value.note}
                                 placeholder={"请输入备注内容"}/>,
        onOk() {
            activeNodes.forEach(activeNode => {
                activeNode.setNote(data.value.note);
            })
        }
    });
}
