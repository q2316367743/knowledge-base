import {MindMapNode} from "@/pages/home/layout/editor-content/editor/MindMapEditor/domain";
import {ref} from "vue";
import {Form, FormItem, Input, Modal, Textarea} from "@arco-design/web-vue";

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
        content: () => <Form model={data.value}>
            <FormItem label={'备注'}>
                {{
                    default: () => <Textarea autoSize={{minRows: 2, maxRows: 8}} v-model={data.value.note} />,
                    help: () => <span></span>
                }}
            </FormItem>
        </Form>,
        onOk() {
            activeNodes.forEach(activeNode => {
                activeNode.setNote(data.value.note);
            })
        }
    });
}
