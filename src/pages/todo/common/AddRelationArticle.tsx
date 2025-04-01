import {useUmami} from "@/plugin/umami";
import {Input, DialogPlugin, Tree} from "tdesign-vue-next";
import {SearchIcon} from 'tdesign-icons-vue-next';
import MessageUtil from "@/utils/modal/MessageUtil";
import {useNoteTree} from "@/hooks/NoteTree";
import {useTodoArticleStore} from "@/store/db/TodoArticleStore";

export function openAddRelationArticle() {
  const keyword = ref('');
  const checkedKeys = ref<Array<number>>(useTodoArticleStore().items);
  const {treeNodeData} = useNoteTree(keyword);

  const size = useWindowSize();

  const p = DialogPlugin({
    header: () => <Input v-model={keyword.value}>{{
      suffixIcon: () => <SearchIcon/>
    }}</Input>,
    default: () => <Tree v-model={checkedKeys.value} data={treeNodeData.value}
                         expandAll={false} checkable={true} style={{height: (size.height.value / 2) + 'px'}}
                         line={true} scroll={{type: 'virtual'}}>{{
      // @ts-ignore
      label: ({node}) => <div class={'flex items-center'}>
        <div>
          <node.data.icon/>
        </div>
        <div class={'ml-6px'}>{node.label}</div>
      </div>
    }}</Tree>,
    confirmBtn: '保存',
    className: 'todo-item-article',
    width: '600px',
    placement: 'center',
    closeOnOverlayClick: false,
    closeBtn: false,
    onConfirm() {
      useTodoArticleStore().associationArticle(checkedKeys.value)
        .then(() => {
          MessageUtil.success("关联成功");
          useUmami.track("/待办/操作/关联笔记");
          p.destroy();
        })
        .catch(e => MessageUtil.error("关联失败", e));
    }
  })
}
