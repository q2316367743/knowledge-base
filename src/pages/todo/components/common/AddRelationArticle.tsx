import {InputSearch, Modal, Tree, TreeNodeData} from "@arco-design/web-vue";
import {computed, ref} from "vue";
import {useFolderStore} from "@/store/db/FolderStore";
import {useArticleStore} from "@/store/db/ArticleStore";
import {searchData, treeEach} from "@/entity/ListTree";
import {useTodoStore} from "@/store/components/TodoStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useWindowSize} from "@vueuse/core";
import {buildArticleIcon} from "@/pages/home/components/he-context";
import {access} from "@/plugin/Statistics";

export function openAddRelationArticle() {
    const keyword = ref('');
    const checkedKeys = ref<Array<number>>(useTodoStore().todoArticles);

    const folderTree = computed(() => useFolderStore().folderTree);
    const folderMap = computed(() => useArticleStore().folderMap);
    const treeData = computed<Array<TreeNodeData>>(() => {
        let treeData = new Array<TreeNodeData>();
        treeEach(folderTree.value, treeData, folderMap.value, e => {
            return {
                ...e,
                checkable: e.isLeaf === true
            }
        });
        treeData = treeData.length === 0 ? [] : (treeData[0].children || []);
        // 文件夹被删除或没有的
        const articleFolders = new Set(Array.from(folderMap.value.keys()));
        useFolderStore().folderIds.forEach(folderId => articleFolders.delete(folderId));
        articleFolders.delete(0);
        articleFolders.forEach(folderId => {
            const articles = folderMap.value.get(folderId);
            if (articles && articles.length > 0) {
                articles.map(article => ({
                    key: article.id,
                    title: article.name,
                    isLeaf: true,
                    icon: () => buildArticleIcon(article.type),
                    checkable: true
                })).forEach(article => treeData.push(article));
            }
        })
        return treeData;
    });
    const treeNodeData = computed(() => searchData(keyword.value, treeData.value));

    const size = useWindowSize();

    Modal.open({
        title: () => <InputSearch v-model={keyword.value}/>,
        content: () => <Tree v-model={[checkedKeys.value, 'checkedKeys']} data={treeNodeData.value}
                             defaultExpandAll={false}
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
