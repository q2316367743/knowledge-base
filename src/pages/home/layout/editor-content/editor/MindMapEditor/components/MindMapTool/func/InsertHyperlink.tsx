import {MindMapNode} from "@/pages/home/layout/editor-content/editor/MindMapEditor/domain";
import {Form, FormItem, Input, Modal} from "@arco-design/web-vue";
import {ref} from "vue";

export function openInsertHyperlink(activeNodes: MindMapNode[]) {
    if (activeNodes.length === 0) {
        return;
    }
    const first = activeNodes[0];
    const data = ref({
        url: first.getData('hyperlink') || '',
        title: first.getData('hyperlinkTitle') || ''
    });
    Modal.open({
        title: "超链接",
        draggable: true,
        content: () => <Form model={data.value}>
            <FormItem label={'地址'}>
                <Input v-model={data.value.url} />
            </FormItem>
            <FormItem label={'标题'}>
                <Input v-model={data.value.title} />
            </FormItem>
        </Form>,
        onOk() {
            activeNodes.forEach(activeNode => {
                activeNode.setHyperlink(data.value.url, data.value.title);
            })
        }
    });
}
