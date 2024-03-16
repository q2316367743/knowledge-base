import {MindMapNode, MindMapTreeNode} from "@/pages/home/layout/editor-content/editor/MindMapEditor/domain";
import {ref} from "vue";
import {Modal, Option, Select} from "@arco-design/web-vue";
import MindMap from "simple-mind-map";

function renderTree(tags: Array<string>, treeNode: MindMapTreeNode) {
    const tag = treeNode.data.tag;
    if (tag) {
        tags.push(...tag);
    }
    if (treeNode.children) {
        treeNode.children.forEach(child => renderTree(tags, child));
    }
}

export function openInsertTag(activeNodes: MindMapNode[], mindMap: MindMap) {
    if (activeNodes.length === 0) {
        return;
    }
    const tags = ref<Array<string>>(activeNodes.flatMap(e => e.getData('tag') || []));

    const treeNode = mindMap.getData(false) as MindMapTreeNode;

    const options = ref<Array<string>>([]);

    renderTree(options.value, treeNode);

    Modal.open({
        title: "标签",
        draggable: true,
        content: () => <div>
            <Select v-model={tags.value} placeholder={'回车创建标签'} allowClear allowCreate allowSearch multiple>
                {options.value.map(option => <Option value={option}>{option}</Option>)}
            </Select>
            <div>回车新增标签，退格删除标签</div>
        </div>,
        onOk() {
            activeNodes.forEach(activeNode => {
                activeNode.setTag(tags.value);
            })
        }
    });
}
