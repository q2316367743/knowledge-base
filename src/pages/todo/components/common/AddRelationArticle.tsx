import {InputSearch, Modal, Tree} from "@arco-design/web-vue";
import {ref} from "vue";
import {useTodoStore} from "@/store/components/TodoStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useWindowSize} from "@vueuse/core";
import {access} from "@/plugin/Statistics";
import {useNoteTree} from "@/hooks/NoteTree";

export function openAddRelationArticle() {
    const keyword = ref('');
    const checkedKeys = ref<Array<number>>(useTodoStore().todoArticles);
    const {treeNodeData} = useNoteTree(keyword);

    const size = useWindowSize();

    Modal.open({
        title: () => <InputSearch v-model={keyword.value}/>,
        content: () => <Tree v-model={[checkedKeys.value, 'checkedKeys']} data={treeNodeData.value}
                             defaultExpandAll={false} checkable={true}
                             blockNode virtualListProps={{height: size.height.value / 2}}/>,
        okText: '保存',
        bodyClass: 'todo-item-article',
        width: '600px',
        titleAlign: "start",
        maskClosable: false,
        closable: false,
        onOk() {
            useTodoStore().associationArticle(checkedKeys.value)
                .then(() => {
                    MessageUtil.success("关联成功");
                    access("待办关联文章");
                })
                .catch(e => MessageUtil.error("关联失败", e));
        }
    })
}
