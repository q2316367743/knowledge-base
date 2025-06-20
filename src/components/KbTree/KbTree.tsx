import {KbTreeNodeData} from "@/components/KbTree/types";
import {KbTreeNode} from '@/components/KbTree/KbTreeNode';
import './KbTree.less';


export const KbTree = defineComponent({
  name: 'KbTree',
  props: {
    data: {
      type: Object as PropType<Array<KbTreeNodeData>>,
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
  setup: (props, {emit}) => {
    const {data, expandKeys, selectKey} = props;
    return () => (
      <div class="kb-tree">
        {data.map((node) => (
          <KbTreeNode key={node.value} node={node} expandKeys={expandKeys} selectKey={selectKey}
                      onClick={e => emit('click', e)}
                      onContextmenu={e => emit('contextmenu', e)}/>
        ))}
      </div>
    );
  }
})