import {searchData, treeEach} from "@/entity/ListTree";
import {useFolderStore} from "@/store/db/FolderStore";
import {buildArticleIcon} from "@/pages/note/components/he-context";
import {useArticleStore} from "@/store/db/ArticleStore";
import {KbTreeNodeData} from "@/components/KbTree/types";

interface UseNoteTree {
  treeData: ComputedRef<Array<KbTreeNodeData>>;
  treeNodeData: ComputedRef<Array<KbTreeNodeData>>
}

export function useNoteTree(keyword?: Ref<string>, map?: (data: KbTreeNodeData) => KbTreeNodeData): UseNoteTree {
  const treeData = computed<Array<KbTreeNodeData>>(() => {
    const {folderTree} = useFolderStore();
    const {folderMap} = useArticleStore();
    let treeData = new Array<KbTreeNodeData>();
    treeEach(folderTree, treeData, folderMap, map);
    treeData = treeData.length === 0 ? [] : ((treeData[0].children as Array<KbTreeNodeData>) || []);
    // 文件夹被删除或没有的
    const articleFolders = new Set(Array.from(folderMap.keys()));
    useFolderStore().folderIds.forEach(folderId => articleFolders.delete(folderId));
    articleFolders.delete(0);
    articleFolders.forEach(folderId => {
      const articles = folderMap.get(folderId);
      if (articles && articles.length > 0) {
        articles.map(article => ({
          value: article.id,
          label: article.name,
          leaf: true,
          icon: () => buildArticleIcon(article.type, article.preview),
          pid: 0,
          preview: article.preview,
          color: article.fontColor
        })).forEach(article => treeData.push(article));
      }
    })
    return treeData;
  });
  const treeNodeData = computed(() => searchData(keyword?.value || '', treeData.value));

  return {treeData, treeNodeData};
}
