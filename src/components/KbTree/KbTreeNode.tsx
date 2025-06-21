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
  emits: ['click', 'contextmenu', 'NodeDrop'],
  setup(props, {emit}) {
    const {node, expandKeys, selectKey} = toRefs(props);
    const isExpanded = ref(false);
    const toggleIsExpanded = useToggle(isExpanded);

    const hasChildren = isNull(node.value.leaf) ? (node.value.children && node.value.children.length > 0) : !node.value.leaf;

    const setIsExpanded = (e: MouseEvent) => {
      if (hasChildren) toggleIsExpanded();
      else emit('click', {node: node.value, e})
    }
    const handleContextmenu = (e: MouseEvent) => {
      emit('contextmenu', {node: node.value, e})
    }


    // 处理拖拽开始事件
    const handleDragStart = (e: DragEvent) => {
      if (node.value.leaf) {
        e.dataTransfer?.setData('text/plain', `${node.value.value}`);
        e.stopPropagation();
      }
    };

    // 处理拖拽经过事件
    const handleDragOver = (e: DragEvent) => {
      if (!node.value.leaf) {
        e.preventDefault();
        e.dataTransfer && (e.dataTransfer.dropEffect = 'move');
        e.stopPropagation();
      }
    };

    // 处理放置事件
    const handleDrop = (e: DragEvent) => {
      if (!node.value.leaf) {
        e.preventDefault();
        const draggedNodeId = e.dataTransfer?.getData('text/plain') || '0';
        emit('NodeDrop', {
          draggedNodeId: typeof node.value.value == 'number' ? parseInt(draggedNodeId) : draggedNodeId,
          targetFolderId: node.value.value,
          e
        })
        e.stopPropagation();
      }
    };

    return () => (
      <div class="kb-tree-node">
        <div class={{'kb-tree-node-content': true, select: node.value.value === selectKey.value}}
             onClick={setIsExpanded} onContextmenu={handleContextmenu}
             draggable={node.value.leaf}
             onDragstart={handleDragStart}
             onDragover={handleDragOver}
             onDrop={handleDrop}>
          <div class={'kb-tree-node-content__chevron'}>
            {hasChildren && (isExpanded.value ? (
              <ChevronDownIcon/>
            ) : (
              <ChevronRightIcon/>
            ))}
          </div>

          <span class="kb-tree-node-content__icon">
            {node.value.icon ? <node.value.icon/> : hasChildren ? <FolderIcon/> : <FileIcon/>}
          </span>

          <span class="kb-tree-node-content__label ellipsis"
                style={{color: node.value.color}}>{node.value.text || node.value.label}</span>
        </div>

        {isExpanded.value && hasChildren && (
          <div class="kb-tree-node-children">
            {(node.value.children || []).map((child) => (
              <KbTreeNode key={child.value} node={child} expandKeys={expandKeys.value} selectKey={selectKey.value}
                          onClick={e => emit('click', e)} onContextmenu={e => emit('contextmenu', e)}
                          onNodeDrop={e => emit('NodeDrop', e)}/>
            ))}
          </div>
        )}
      </div>
    )
  }
})