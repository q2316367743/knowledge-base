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
    <t-tree :data="treeNodeData" :scroll="scroll" :height="virtualHeight" :checkable="checkKeys.length > 0"
            :default-expand-all="false" :allow-drop="checkAllowDrop" :draggable="true" :line="true"
            value-mode="onlyLeaf" style="margin: 0 7px;" :activable="true" :hover="true"
            :actived="selectedKeys" v-model="checkKeys" v-model:expanded="expandedKeys"
            @drop="onDrop($event)">
      <template #label="{ node }">
        <div class="flex justify-between w-full" :class="{active: homeEditorId===node.value}"
             @contextmenu="onContextmenu(node, $event)" @click="onSelect(node.value)">
          <div class="flex items-center">
            <div :class="{'pt-6px': node.data.preview}">
              <component :is="node.data.icon"/>
            </div>
            <span class="mtl-ml p-3px">{{ node.label }}</span>
          </div>
        </div>
      </template>
      <template #operations="{ node }">
        <editor-tree-menu :id="node.value" :name="node.label" :folder="!node.data.leaf"
                          @multi="multiCheckStart">
          <t-button class="mr-4px" variant="text" shape="square" theme="primary" size="small" @click.stop>
            <template #icon>
              <icon-more/>
            </template>
          </t-button>
        </editor-tree-menu>
      </template>
    </t-tree>
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
import {TreeNodeModel, TypeTreeProps} from 'tdesign-vue-next';
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
import {openFolderChoose} from "@/components/ArticePreview/FolderChoose";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import EditorTreeMenu from "@/pages/note/layout/editor-side/components/EditorTreeMenu.vue";
import {openEditorTreeMenu} from "@/pages/note/layout/editor-side/components/EditorTreeMenu";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";

interface DropContext {
  e: DragEvent;
  dragNode: TreeNodeModel;
  dropNode: TreeNodeModel;
  // 拖拽位置，0: 内，-1：上，1：下
  dropPosition: number;
}

const homeEditorSideRef = ref();
const size = useElementSize(homeEditorSideRef);

const selectedKeys = computed<Array<number>>(() => homeEditorId.value === 0 ? [] : [homeEditorId.value]);
const checkKeys = ref<Array<number>>([]);
const expandedKeys = useUtoolsDbStorage<Array<number>>(LocalNameEnum.KEY_HOME_EXPANDED_KEYS, []);

const virtualHeight = computed(() => (size.height.value - 36) + 'px');
const scroll = computed<TypeTreeProps['scroll']>(() => ({
  type: 'virtual'
}))
const {treeNodeData} = useNoteTree(keyword);

watch(homeEditorId, id => {
  expandTo(id);
});

function onSelect(id: number | string) {
  if (!id) return;
  if (typeof id === 'string') {
    id = Number(id);
  }
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

function checkAllowDrop(options: DropContext): boolean {
  const {leaf} = options.dropNode.data;
  if (options.dragNode.data.pid === options.dropNode.data.pid) {
    // 同目录不能拖拽
    return false;
  }
  if (leaf) {
    // 子节点，不能为0
    return options.dropPosition !== 0;
  } else {
    // 文件夹，可以为0
    return true;
  }
}

function onDrop(data: DropContext) {
  let dragId = data.dragNode.value as number;
  let dropId = data.dropNode.value as number;

  const {leaf, pid} = data.dropNode.data;
  if (leaf) {
    if (data.dropPosition === 0) {
      return;
    }
    dropId = pid;
  }
  if (data.dragNode.data.leaf) {
    // 笔记
    useArticleStore().drop(dragId, dropId)
      .then(() => MessageUtil.success("移动成功"))
      .catch(e => MessageUtil.error("移动失败", e));
  } else {
    useFolderStore().drop(data.dragNode.value as number, data.dropNode.value as number)
      .then(() => MessageUtil.success("移动成功"))
      .catch(e => MessageUtil.error("移动失败", e));
  }
}

expandTo(homeEditorId.value);

/**
 * 展开笔记所在的文件夹
 * @param id 笔记ID
 */
function expandTo(id: number) {
  const article = useArticleStore().articleMap.get(id);
  if (article && article.folder !== 0) {
    _expandTo(article.folder);
  }
}

/**
 * 展开文件夹
 * @param id 文件夹ID
 */
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

function onContextmenu(node: TreeNodeModel, e: MouseEvent) {
  openEditorTreeMenu(e, {node: node.data as any, multi: multiCheckStart, select: onSelect})
}
</script>
<style lang="less">
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
      border: 1px solid var(--td-border-level-1-color);
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      background-color: var(--td-bg-color-container);
    }

  }
}
</style>
