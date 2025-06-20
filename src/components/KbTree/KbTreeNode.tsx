import {ChevronDownIcon, ChevronRightIcon, FileIcon, FolderIcon} from "tdesign-icons-vue-next";
import {KbTreeNodeData} from "@/components/KbTree/types";
import {isNull} from "@/utils/lang/FieldUtil";

export const KbTreeNode = defineComponent({
  name: "KbTreeNode",
  props: {
    node: {
      type: Object as PropType<KbTreeNodeData>,
      required: true
    },
    expandKeys: {
      type: Object as PropType<Array<string | number>>,
      default: () => []
    },
    selectKey: {
      type: [String, Number],
      default: null
    }
  },
  emits: ['click', 'contextmenu'],
  setup(props, {emit}) {
    const {node, expandKeys, selectKey} = props;
    const isExpanded = ref(false);
    const toggleIsExpanded = useToggle(isExpanded);

    const hasChildren = isNull(node.leaf) ? (node.children && node.children.length > 0) : !node.leaf;

    const setIsExpanded = (e: MouseEvent) => {
      if (hasChildren) toggleIsExpanded();
      else emit('click', {node, e})
    }
    const handleContextmenu = (e: MouseEvent) => {
      emit('contextmenu', {node, e})
    }

    return () => (
      <div class="kb-tree-node">
        <div class={{'kb-tree-node-content': true, select: node.value === selectKey}} onClick={setIsExpanded}
             onContextmenu={handleContextmenu}>
          <div class={'kb-tree-node-content__chevron'}>
            {hasChildren && (isExpanded.value ? (
              <ChevronDownIcon/>
            ) : (
              <ChevronRightIcon/>
            ))}
          </div>

          <span class="kb-tree-node-content__icon">
            {hasChildren ? <FolderIcon/> : <FileIcon/>}
          </span>

          <span class="kb-tree-node-content__label ellipsis">{node.label}</span>
        </div>

        {isExpanded.value && hasChildren && (
          <div class="">
            {(node.children || []).map((child) => (
              <KbTreeNode key={child.value} node={child} expandKeys={expandKeys} selectKey={selectKey}
                          onClick={e => emit('click', e)} onContextmenu={e => emit('contextmenu', e)}/>
            ))}
          </div>
        )}
      </div>
    )
  }
})