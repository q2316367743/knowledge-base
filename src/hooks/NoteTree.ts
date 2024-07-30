import {computed, ComputedRef, ref, Ref} from "vue";
import {TreeNodeData} from "@arco-design/web-vue";
import {searchData, treeEach} from "@/entity/ListTree";
import {useFolderStore} from "@/store/db/FolderStore";
import {buildArticleIcon} from "@/pages/home/components/he-context";
import {useArticleStore} from "@/store/db/ArticleStore";

interface UseNoteTree {
    treeData: ComputedRef<Array<TreeNodeData>>;
    treeNodeData: ComputedRef<Array<TreeNodeData>>
}

export function useNoteTree(keyword?: Ref<string>, map?: (data: TreeNodeData) => TreeNodeData): UseNoteTree {
    const folderTree = computed(() => useFolderStore().folderTree);
    const folderMap = computed(() => useArticleStore().folderMap);
    const treeData = computed<Array<TreeNodeData>>(() => {
        let treeData = new Array<TreeNodeData>();
        treeEach(folderTree.value, treeData, folderMap.value, map);
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
                    icon: () => buildArticleIcon(article.type, article.preview),
                    checkable: true
                })).forEach(article => treeData.push(article));
            }
        })
        return treeData;
    });
    if (!keyword) {
        keyword = ref('');
    }
    const _k = keyword;
    const treeNodeData = computed(() => searchData(_k.value, treeData.value));

    return {treeData, treeNodeData};
}
