import ContextMenu, {MenuItem} from "@imengyu/vue3-context-menu";
import {
  AppIcon,
  CheckRectangleIcon,
  DeleteIcon,
  Edit2Icon, FileExportIcon, FileImportIcon,
  FolderAdd1Icon,
  GestureRightIcon,
  PlusIcon
} from "tdesign-icons-vue-next";
import {useGlobalStore, useVipStore} from "@/store";
import {addArticle, addFolder, articleTypes, remove, rename} from "@/pages/note/components/he-context";
import VipIcon from "@/components/KbIcon/VipIcon.vue";
import {useArticleStore} from "@/store/db/ArticleStore";
import {openFolderChoose} from "@/components/ArticePreview/FolderChoose";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useFolderStore} from "@/store/db/FolderStore";
import {showArticleImportModal} from "@/pages/note/components/ArticleImportModal";
import {exportToMd} from "@/pages/note/components/EditorExport";
import {exportToUTools} from "@/components/ArticleExport/exportForUtools";
import {exportForEpub} from "@/components/ArticleExport/exportForEpub";

function moveTo(id: number, name: string, article: boolean) {
  let folderId: number | undefined = undefined;
  if (article) {
    // 笔记，则需要找父文件夹
    const articleIndex = useArticleStore().articleMap.get(id);
    if (articleIndex) {
      folderId = articleIndex.folder;
    }
  } else {
    folderId = id;
  }
  openFolderChoose(folderId).then(folder => {
    if (article) {
      // 更新笔记文件夹
      useArticleStore().updateIndex(id, {folder: folder.id})
        .then(() => MessageUtil.success("移动成功"))
    } else {
      useFolderStore().drop(id, folder.id);
    }
  })
}

interface EditorTreeMenuProps {
  node: EditorTreeNode;
  more?: boolean;
  multi: (id: number) => void;
}

export interface EditorTreeNode {
  key: number;
  title: string;
  isLeaf: boolean;
}

export function openEditorTreeMenu(e: MouseEvent, props: EditorTreeMenuProps) {
  const {noteNoVip} = useVipStore();
  const {node, more = true, multi} = props;

  const items = new Array<MenuItem>();

  if (node.isLeaf) {
    items.push({
      label: '重命名',
      icon: () => <Edit2Icon/>,
      onClick: () => {
        rename(node.key, node.title, node.isLeaf);
      }
    }, {
      label: '更多操作',
      icon: () => <AppIcon/>,
      children: [{
        label: '多选',
        icon: () => <CheckRectangleIcon/>,
        onClick: () => {
          multi(node.key);
        }
      },  {
        label: () => <div style={{color: 'var(--td-error-color)'}}>删除</div>,
        icon: () => <DeleteIcon style={{color: 'var(--td-error-color)'}}/>,
        onClick: () => {
          remove(node.key, node.title, node.isLeaf);
        }
      }, {
        label: '移动到',
        icon: () => <GestureRightIcon/>,
        onClick: () => {
          moveTo(node.key, node.title, node.isLeaf);
        }
      }]
    });
  } else {
    // 文件夹
    items.push({
      label: '新建笔记',
      icon: () => <PlusIcon/>,
      children: articleTypes.map(type => ({
        label: () => <div class={'flex items-center'}>
          <span>{type.name}</span>
          {(type.vip && noteNoVip) && <VipIcon class={'ml-8px'}/>}
        </div>,
        icon: () => <type.icon/>,
        onClick: () => {
          addArticle(node.key, type);
        }
      }))
    }, {
      label: '新建文件夹',
      icon: () => <FolderAdd1Icon/>,
      onClick: () => {
        addFolder(node.key);
      }
    });
    if (more) {
      items.push({
        label: '更多操作',
        icon: () => <AppIcon/>,
        children: [{
          label: '多选',
          icon: () => <CheckRectangleIcon/>,
          onClick: () => {
            multi(node.key);
          }
        }, {
          label: '重命名',
          icon: () => <Edit2Icon/>,
          onClick: () => {
            rename(node.key, node.title, node.isLeaf);
          }
        }, {
          label: () => <div style={{color: 'var(--td-error-color)'}}>删除</div>,
          icon: () => <DeleteIcon style={{color: 'var(--td-error-color)'}}/>,
          onClick: () => {
            remove(node.key, node.title, node.isLeaf);
          }
        }, {
          label: '移动到',
          icon: () => <GestureRightIcon/>,
          onClick: () => {
            moveTo(node.key, node.title, node.isLeaf);
          }
        }]
      })
    }
    items.push({
      label: '笔记导入',
      icon: () => <FileImportIcon />,
      children: [{
        label: '常规导入',
        onClick: ()  => {
          showArticleImportModal(node.key);
        }
      }, {
        label: 'Gitee',
        disabled: true,
      }, {
        label: 'GitHub',
        disabled: true,
      }]
    }, {
      label: '笔记导出',
      icon: () => <FileExportIcon />,
      children: [{
        label: 'ZIP',
        onClick: ()  => {
          exportToMd(node.key)
        }
      }, {
        label: 'uTools文档插件',
        onClick: ()  => {
          exportToUTools(node.key)
        }
      }, {
        label: 'Epub',
        onClick: ()  => {
          exportForEpub(node.key)
        }
      }]
    });
  }

  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: useGlobalStore().isDark ? "default-dark" : "default",
    items
  })
}