<template>
  <div class="home-editor-side" ref="homeEditorSideRef">
    <header class="m-2">
      <t-input-group style="width: 100%">
        <t-input style="width: calc(100% - 32px);" v-model="keyword" :clearable="true" placeholder="请输入文件名"/>
        <editor-tree-menu :id="0" :more="false" @multi="multiCheckStart">
          <t-button theme="primary" shape="square">
            <template #icon>
              <icon-more-vertical/>
            </template>
          </t-button>
        </editor-tree-menu>
      </t-input-group>
    </header>
    <Draggable class="note-tree p-4px" v-model="treeNodeData" tree-line virtualization :style="{height: virtualHeight}"
               ref="tree" root-droppable :drag-copy="false" :each-droppable="checkAllowDrop" @change="onDrop">
      <template #default="{ node, stat }">
        <div class="note-tree-node flex justify-between p-1px pl-4px"
             :class="{active: homeEditorId===node.key}"
             @click="onSelect(node.key)" @contextmenu="openEditorTreeMenu($event, {node, multi: multiCheckStart})">
          <div class="flex items-center">
            <OpenIcon
              v-if="!node.isLeaf"
              :open="stat.open"
              class="mtl-mr"
              @click.native="stat.open = !stat.open"
            />
            <t-checkbox
              v-if="checkKeys.length > 0"
              class="mtl-checkbox mtl-mr"
              type="checkbox"
              :checked="multiChecked(node.key)"
              @change="multiCheckClick(node.key)"
              @click.stop
            />
            <component :is="node.icon"/>
            <span class="mtl-ml p-3px">{{ node.title }}</span>
          </div>
          <editor-tree-menu :id="node.key" :name="node.title" :folder="!node.isLeaf"
                            @multi="multiCheckStart">
            <t-button class="mr-4px" variant="text" shape="square" theme="primary" size="small" @click.stop>
              <template #icon>
                <icon-more/>
              </template>
            </t-button>
          </editor-tree-menu>
        </div>
      </template>
    </Draggable>
    <div class="option" v-if="checkKeys.length > 0">
      <t-space class="btn" size="small">
        <t-popconfirm content="确认删除这些笔记，注意：不会删除目录" @confirm="multiCheckDelete()">
          <t-button theme="danger" variant="text" shape="square">
            <template #icon>
              <delete-icon/>
            </template>
          </t-button>
        </t-popconfirm>
        <t-tooltip content="移动到">
          <t-button theme="primary" variant="text" shape="square" @click="moveMultiTo()">
            <template #icon>
              <icon-to-right/>
            </template>
          </t-button>
        </t-tooltip>
        <t-tooltip content="全选">
          <t-button theme="primary" variant="text" shape="square" @click="selectAll()">
            <template #icon>
              <icon-select-all/>
            </template>
          </t-button>
        </t-tooltip>
        <t-button theme="primary" variant="text" shape="square" @click="multiCheckStop()">
          <template #icon>
            <close-icon/>
          </template>
        </t-button>
      </t-space>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {Draggable, OpenIcon, DraggableTreeType} from '@he-tree/vue'
import {CloseIcon, DeleteIcon} from "tdesign-icons-vue-next";
import {
  useGlobalStore,
  useArticleStore,
  useFolderStore,
  homeEditorId,
  useHomeEditorStore,
  useBaseSettingStore
} from "@/store";
import {useNoteTree} from "@/hooks";
import {keyword} from "@/global/BeanFactory";
import Constant from "@/global/Constant";
import MessageUtil from "@/utils/modal/MessageUtil";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import {openFolderChoose} from "@/components/ArticePreview/FolderChoose";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import EditorTreeMenu from "@/pages/note/layout/editor-side/components/EditorTreeMenu.vue";
import {openEditorTreeMenu} from "@/pages/note/layout/editor-side/components/EditorTreeMenu";
import {PropDroppable} from "@he-tree/vue/dist/v3/components/DraggableTree";

const homeEditorSideRef = ref();
const tree = ref<DraggableTreeType>();

const size = useElementSize(homeEditorSideRef);

const selectedKeys = ref<Array<number>>(homeEditorId.value === 0 ? [] : [homeEditorId.value]);
const checkKeys = ref<Array<number>>([]);
const expandedKeys = ref<Array<number>>(getItemByDefault<Array<number>>(LocalNameEnum.KEY_HOME_EXPANDED_KEYS, []));

const virtualHeight = computed(() => (size.height.value - 44) + 'px');
const {treeNodeData} = useNoteTree(keyword);

watch(homeEditorId, id => {
  selectedKeys.value = [id];
  expandTo(id);
});


watch(() => expandedKeys.value, value => setItem(LocalNameEnum.KEY_HOME_EXPANDED_KEYS, value), {deep: true});

function onSelect(id: number) {
  if (useArticleStore().articleMap.has(id)) {
    useHomeEditorStore().openArticle(id);
    if (useBaseSettingStore().autoCollapsedByEditor && size.width.value < Constant.autoCollapsedWidth) {
      useHomeEditorStore().switchCollapsed();
    }
  } else {
    const index = expandedKeys.value.indexOf(id);
    if (index === -1) {
      // 不存在，展开
      _expandTo(id);
    } else {
      // 存在，收起
      expandedKeys.value.splice(index, 1);
    }
  }
}


function multiCheckStart(id: number) {
  checkKeys.value.push(id);
}

function multiCheckStop() {
  checkKeys.value = [];
}

function multiCheckClick(id: number) {
  const index = checkKeys.value.indexOf(id);
  if (index === -1) {
    checkKeys.value.push(id);
  } else {
    checkKeys.value.splice(index, 1);
  }
}

function multiChecked(id: number) {
  return checkKeys.value.indexOf(id) !== -1;
}

function multiCheckDelete() {
  useGlobalStore().startLoading("开始删除")
  useArticleStore().removeBatchByIds(checkKeys.value)
    .then(() => MessageUtil.success("删除成功"))
    .catch(e => MessageUtil.error("删除失败", e))
    .finally(() => {
      useGlobalStore().closeLoading();
      checkKeys.value = [];
    });
}

const checkAllowDrop: PropDroppable = (options) => {
  return !options.data.isLeaf;
}

function onDrop(a: any, b: any, c: any, d: any) {
  console.log(a, b, c, d);
  // if (typeof data.dragNode.key !== 'undefined' &&
  //   typeof data.dropNode.key !== 'undefined') {
  //   if (data.dropPosition === 0) {
  //     if (data.dragNode.isLeaf) {
  //       // 笔记
  //       useArticleStore().drop(data.dragNode.key as number, data.dropNode.key as number)
  //         .then(() => MessageUtil.success("移动成功"))
  //         .catch(e => MessageUtil.error("移动失败", e));
  //     } else {
  //       useFolderStore().drop(data.dragNode.key as number, data.dropNode.key as number)
  //         .then(() => MessageUtil.success("移动成功"))
  //         .catch(e => MessageUtil.error("移动失败", e));
  //     }
  //   } else {
  //     // 上或者下
  //     const target = useFolderStore().folderMap.get(data.dropNode.key as number);
  //     if (!target) {
  //       return;
  //     }
  //     if (data.dragNode.isLeaf) {
  //       // 笔记
  //       useArticleStore().drop(data.dragNode.key as number, target.pid)
  //         .then(() => MessageUtil.success("移动成功"))
  //         .catch(e => MessageUtil.error("移动失败", e));
  //     } else {
  //       useFolderStore().drop(data.dragNode.key as number, target.pid)
  //         .then(() => MessageUtil.success("移动成功"))
  //         .catch(e => MessageUtil.error("移动失败", e));
  //     }
  //   }
  // }
}


expandTo(homeEditorId.value);

function expandTo(id: number) {
  const article = useArticleStore().articleMap.get(id);
  if (article && article.folder !== 0) {
    _expandTo(article.folder);
  }
}

function _expandTo(id: number) {
  if (id === 0) {
    return;
  }
  const parent = useFolderStore().folderMap.get(id);
  if (parent) {
    _expandTo(parent.pid);
  }
  if (expandedKeys.value.indexOf(id) === -1) {
    expandedKeys.value.push(id);
  }
}

function selectAll() {
  checkKeys.value = useArticleStore().articles.map(e => e.id);
}

function moveMultiTo() {
  openFolderChoose().then(folder => {
    useGlobalStore().startLoading("开始移动");
    try {
      const articleMap = useArticleStore().articleMap;
      // 笔记
      const articleIds = checkKeys.value.filter(id => articleMap.has(id));
      if (articleIds.length > 0) {
        useArticleStore().updateMultiIndex(articleIds.map(id => ({
          id,
          folder: folder.id
        })))
      }
      const {folderMap} = useArticleStore();
      // 文件夹
      const folderIds = checkKeys.value.filter(id => folderMap.has(id));
      if (folderIds.length > 0) {
        useFolderStore().updateMulti(folderIds.map(id => ({
          id,
          pid: folder.id
        })))
      }
      checkKeys.value = [];
      MessageUtil.success("移动成功");
    } catch (e) {
      MessageUtil.error("移动失败");
    } finally {
      useGlobalStore().closeLoading();
    }
  })
}

</script>
<style lang="less" scoped>
.home-editor-side {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;

  .option {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 14px;
    display: flex;
    justify-content: center;

    .btn {
      border: 1px solid var(--color-neutral-3);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      background-color: rgba(255, 255, 255, 0.6);
    }
  }

  .note-tree {
    .note-tree-node {
      cursor: pointer;

      &:hover {
        background-color: var(--td-bg-color-container-hover);
      }

      &.active {
        background-color: var(--td-bg-color-container-active);
      }
    }
  }
}

</style>
