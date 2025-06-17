import ContextMenu, {MenuItem} from "@imengyu/vue3-context-menu";
import {
  AppIcon,
  CheckRectangleIcon,
  DeleteIcon,
  Edit2Icon, ExtensionIcon, FileExportIcon, FileImportIcon, FillColor1Icon,
  FolderAdd1Icon,
  GestureRightIcon,
  PlusIcon, RoundIcon, TagFilledIcon, TagIcon, TerminalWindowIcon
} from "tdesign-icons-vue-next";
import {useArticleStore, useFolderStore, useGlobalStore, useVipStore} from "@/store";
import MessageUtil from "@/utils/modal/MessageUtil";
import {openFolderChoose} from "@/components/ArticePreview/FolderChoose";
import {exportToUTools, exportForEpub} from "@/components/ArticleExport";
import {
  addFolder,
  extraNoteTypes,
  mainNoteTypes,
  remove,
  rename
} from "@/pages/note/components/he-context";
import {showArticleImportModal} from "@/pages/note/components/ArticleImportModal";
import {addNoteFunc} from "@/utils/component/AddNoteUtil";
import {openArticleImportWithUBrowser} from "@/modules/NoteImport";
import {setColor} from "@/pages/note/components/HeExtraContext";
import VipIcon from "@/components/KbIcon/VipIcon.vue";
import {openNotePreview} from "@/widget/NotePreview";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";
import {UToolsUtil} from "@/utils/utools/UToolsUtil";
import {exportToZip} from "@/utils/utools/BackgroundUtil";
import {getPlatform} from "@/utils/utools/common";

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
        .catch(e => MessageUtil.error(`移动笔记「${name}」失败`, e));
    } else {
      useFolderStore().drop(id, folder.id)
        .then(() => MessageUtil.success("移动成功"))
        .catch(e => MessageUtil.error(`移动文件夹「${name}」失败`, e));
    }
  })
}

interface EditorTreeMenuProps {
  // 右键的节点
  node: EditorTreeNode;
  // 是否显示更多选项
  more?: boolean;
  // 当点击多选
  multi: (id: number) => void;
  // 当点击选择
  select: (id: number | string) => void;
}

export interface EditorTreeNode {
  value: number;
  label: string;
  leaf: boolean;
}

export function openEditorTreeMenu(e: MouseEvent, props: EditorTreeMenuProps) {
  e.preventDefault();
  e.stopPropagation();
  const {noteNoVip} = useVipStore();
  const {node, multi} = props;

  const items = new Array<MenuItem>();
  const platform = getPlatform();

  if (node.leaf) {
    // 一个笔记
    const children = new Array<MenuItem>();
    children.push({
      label: '设置颜色',
      icon: () => <FillColor1Icon/>,
      onClick: () => setColor(node.value, node.leaf)
    }, {
      label: '多选',
      icon: () => <CheckRectangleIcon/>,
      onClick: () => multi(node.value)
    }, {
      label: '移动到',
      icon: () => <GestureRightIcon/>,
      onClick: () => moveTo(node.value, node.label, node.leaf)
    });
    if (InjectionUtil.env.isUtools()) {
      // 判断关键字
      const code = `note:${node.value}`;
      const feature = UToolsUtil.feature.getFeatureOne(code);
      const hasFeature = !!feature;
      children.push({
        label: (hasFeature ? '删除' : '加入') + '关键字',
        icon: () => hasFeature ? <TagFilledIcon/> : <TagIcon/>,
        onClick: () => {
          if (hasFeature) {
            // 删除关键字
            UToolsUtil.feature.removeFeatureOne(code)
          } else {
            // 加入关键字
            UToolsUtil.feature.setFeatureOneSimple(code, node.label);
          }
        }
      })
    }

    items.push({
      label: '打开',
      icon: () => <RoundIcon/>,
      onClick: () => props.select(node.value)
    }, {
      label: '小窗打开',
      icon: () => <TerminalWindowIcon/>,
      onClick: () => {
        openNotePreview(node.value);
      }
    }, {
      label: '重命名',
      icon: () => <Edit2Icon/>,
      divided: 'up',
      onClick: () => {
        rename(node.value, node.label, node.leaf);
      }
    }, {
      label: () => <div style={{color: 'var(--td-error-color)'}}>删除</div>,
      icon: () => <DeleteIcon style={{color: 'var(--td-error-color)'}}/>,
      onClick: () => {
        remove(node.value, node.label, node.leaf);
      }
    }, {
      label: '更多操作',
      icon: () => <AppIcon/>,
      children
    });
  } else {
    // 文件夹
    items.push({
      label: '新建笔记',
      icon: () => <PlusIcon/>,
      children: [
        ...mainNoteTypes.map(type => ({
          label: () => <div class={'flex items-center'}>
            <span>{type.name}</span>
            {(type.vip && noteNoVip) && <VipIcon class={'ml-8px'}/>}
          </div>,
          icon: () => <type.icon/>,
          onClick: () => {
            addNoteFunc({pid: node.value, type: type.key});
          }
        })),
        {
          label: '更多笔记',
          icon: () => <ExtensionIcon/>,
          children: extraNoteTypes.map(type => ({
            label: () => <div class={'flex items-center'}>
              <span>{type.name}</span>
              {(type.vip && noteNoVip) && <VipIcon class={'ml-8px'}/>}
            </div>,
            icon: () => <type.icon/>,
            onClick: () => {
              addNoteFunc({pid: node.value, type: type.key});
            }
          }))
        }
      ]
    }, {
      label: '新建文件夹',
      icon: () => <FolderAdd1Icon/>,
      divided: 'down',
      onClick: () => {
        addFolder(node.value);
      }
    });
    if (node.value !== 0) {
      items.push({
        label: '重命名',
        icon: () => <Edit2Icon/>,
        onClick: () => {
          rename(node.value, node.label, node.leaf);
        }
      }, {
        label: () => <div style={{color: 'var(--td-error-color)'}}>删除</div>,
        icon: () => <DeleteIcon style={{color: 'var(--td-error-color)'}}/>,
        onClick: () => {
          remove(node.value, node.label, node.leaf);
        }
      }, {
        label: '更多操作',
        icon: () => <AppIcon/>,
        divided: 'down',
        children: [{
          label: '设置颜色',
          icon: () => <FillColor1Icon/>,
          onClick: () => {
            setColor(node.value, node.leaf);
          }
        }, {
          label: '多选',
          icon: () => <CheckRectangleIcon/>,
          onClick: () => {
            multi(node.value);
          }
        }, {
          label: '移动到',
          icon: () => <GestureRightIcon/>,
          onClick: () => {
            moveTo(node.value, node.label, node.leaf);
          }
        }]
      })
    }
    items.push({
      label: '笔记导入',
      icon: () => <FileImportIcon/>,
      children: [{
        label: '常规导入',
        onClick: () => showArticleImportModal(node.value)
      }, {
        label: '粘贴链接',
        onClick: () => openArticleImportWithUBrowser(node.value)
      }, {
        label: 'Gitee',
        disabled: true,
      }, {
        label: 'GitHub',
        disabled: true,
      }]
    }, {
      label: '笔记导出',
      icon: () => <FileExportIcon/>,
      children: [{
        label: 'ZIP',
        onClick: () => exportToZip(node.value),
        disabled: platform === 'tauri'
      }, {
        label: 'uTools文档插件',
        onClick: () => exportToUTools(node.value),
        disabled: platform !== 'uTools'
      }, {
        label: 'Epub',
        onClick: () => exportForEpub(node.value),
        disabled: platform !== 'uTools'
      }]
    });
  }

  const {isDark} = useGlobalStore();
  e.preventDefault();
  ContextMenu.showContextMenu({
    x: e.x,
    y: e.y,
    theme: isDark ? "default dark" : "default",
    items
  })
}