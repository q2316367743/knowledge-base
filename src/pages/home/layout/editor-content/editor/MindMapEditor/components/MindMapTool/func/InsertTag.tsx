import {MindMapNode} from "@/pages/home/layout/editor-content/editor/MindMapEditor/domain";
import {ref} from "vue";
import {Button, Input, InputGroup, Modal, Tag} from "@arco-design/web-vue";
import MessageUtil from "@/utils/MessageUtil";

export function openInsertTag(activeNodes: MindMapNode[]) {
    if (activeNodes.length === 0) {
        return;
    }
    const first = activeNodes[0];
    const text = ref("");
    const tags = ref<Array<string>>(first.getData('tag') || []);

    function add() {
        if (tags.value.some(tag => tag === text.value)) {
            MessageUtil.warning("标签已存在");
            return;
        }
        tags.value.push(text.value);
        text.value = '';
    }

    function close(tag: string) {
        tags.value = tags.value.filter(t => t !== tag);
    }

    Modal.open({
        title: "标签",
        draggable: true,
        content: () => <div>
            <InputGroup style="width: 100%">
                <Input v-model={text.value}></Input>
                <Button type={'primary'} onClick={add}>新增</Button>
            </InputGroup>
            {tags.value.map(tag => <Tag key={tag} color={'arcoblue'} style={{marginRight: '7px', marginTop: '4px'}}
                                        closable onClose={() => close(tag)}>{tag}</Tag>)}
        </div>,
        onOk() {
            activeNodes.forEach(activeNode => {
                activeNode.setTag(tags.value);
            })
        }
    });
}
