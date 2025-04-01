import {MindMapNode, MindMapTreeNode} from "@/editor/MindMapEditor/domain";
import {DialogPlugin, FormItem, TagInput} from "tdesign-vue-next";
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

  const p = DialogPlugin({
    header: "标签",
    draggable: true,
    placement: 'center',
    default: () => <FormItem help={'回车新增标签，退格删除标签'} class={'mt-16px'}>
      <TagInput v-model={tags.value} placeholder={'回车创建标签'} />
    </FormItem>,
    onConfirm() {
      activeNodes.forEach(activeNode => {
        activeNode.setTag(tags.value);
      });
      p.destroy();
    }
  });
}
