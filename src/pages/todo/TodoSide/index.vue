<template>
  <div class="todo-side">
    <header class="m-2">
      <t-input-group>
        <t-input style="width: 233px;" v-model="keyword" allow-clear placeholder="请输入清单名称"/>
        <t-button theme="primary" shape="square" @click="add(0)">
          <template #icon>
            <icon-plus/>
          </template>
        </t-button>
      </t-input-group>
    </header>
    <t-tree :actived="selectKeys" :data="treeNodeData" :line="true" :activable="true" :draggable="true"
            :style="{margin: '7px',width:' calc(100% - 14px)', height: virtualHeight}" :scroll="{type: 'virtual'}"
            :allow-drop="checkAllowDrop" @drop="onDrop($event)" @click="onClick" v-model:expanded="expanded">
      <template #label="{node}">
        <div class="flex items-center">
          <list-icon v-if="node.data.leaf"/>
          <folder-icon v-else/>
          <span class="text-ellipsis ml-8px" :title="node.label">{{ node.label }}</span>
        </div>
      </template>
      <template #operations="{node}">
        <t-dropdown trigger="click">
          <t-button variant="text" theme="primary" shape="square" @click.stop>
            <template #icon>
              <icon-more/>
            </template>
          </t-button>
          <t-dropdown-menu>
            <t-dropdown-item v-if="!node.data.leaf" @click="add(node.value)">
              <template #prefix-icon>
                <plus-icon/>
              </template>
              新增
            </t-dropdown-item>
            <t-dropdown-item @click="update(node.value)">
              <template #prefix-icon>
                <edit2-icon/>
              </template>
              修改
            </t-dropdown-item>
            <t-dropdown-item v-if="!node.children || node.children.length === 0"
                             @click="remove(node.value, node.label)" style="color: red;">
              <template #prefix-icon>
                <delete-icon/>
              </template>
              删除
            </t-dropdown-item>
            <t-dropdown-item v-if="node.leaf" @click="switchFeature(node.value)">
              <template #prefix-icon>
                <star-filled-icon v-if="hasFeature(node.value)"/>
                <star-icon v-else/>
              </template>
              快速启动
            </t-dropdown-item>
          </t-dropdown-menu>
        </t-dropdown>
      </template>
    </t-tree>
  </div>
</template>
<script lang="ts" setup>
import {DeleteIcon, Edit2Icon, FolderIcon, ListIcon, PlusIcon, StarFilledIcon, StarIcon} from "tdesign-icons-vue-next";
import {TreeNodeModel} from "tdesign-vue-next";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {TodoCategoryTypeEnum} from "@/entity/todo/TodoCategory";
import {searchData} from "@/entity/ListTree";
import Constant from "@/global/Constant";
import {openAddTodoCategory, openUpdateTodoCategory} from "@/pages/todo/TodoSide/AddTodoCategory";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import LocalNameEnum from "@/enumeration/LocalNameEnum";

interface DropContext {
  e: DragEvent;
  dragNode: TreeNodeModel;
  dropNode: TreeNodeModel;
  // 拖拽位置，0: 内，-1：上，1：下
  dropPosition: number;
}

const size = useWindowSize();

const keyword = ref('')
const expanded = useUtoolsDbStorage<Array<string | number>>(LocalNameEnum.KEY_TODO_EXPANDED, []);

const selectKeys = computed(() => ([useTodoWrapStore().categoryId]));

const todoCategoryTree = computed(() => useTodoCategoryStore().todoCategoryTree);
const virtualHeight = computed(() => (size.height.value - 56) + 'px');
const treeNodeData = computed(() => searchData(keyword.value, todoCategoryTree.value));

function onClick(context: {
  node: TreeNodeModel;
  e: MouseEvent;
}) {
  const {node} = context;
  if (!node.data.leaf) {
    // 文件夹
    const index = expanded.value.findIndex((item) => item === node.value);
    if (expanded.value.findIndex((item) => item === node.value) > -1) {
      // 已展开，关闭
      expanded.value.splice(index, 1);
    } else {
      expanded.value.push(node.value!);
    }
    return;
  }
  const categoryId = node.value as number;
  let category = useTodoCategoryStore().todoCategoryMap.get(categoryId);
  if (category && category.type === TodoCategoryTypeEnum.TODO) {
    if (categoryId !== useTodoWrapStore().categoryId) {
      useTodoWrapStore().init(categoryId);
    }
    if (useBaseSettingStore().autoCollapsedByTodo && size.width.value < Constant.autoCollapsedWidth) {
      useTodoWrapStore().switchCollapsed();
    }
  } else {
    useTodoWrapStore().init(0);
  }

}

const hasFeature = (id: number) => useTodoCategoryStore().hasFeature(id);
const addFeature = (id: number) => useTodoCategoryStore().addFeature(id);
const removeFeature = (id: number) => useTodoCategoryStore().removeFeature(id);

function switchFeature(id: number) {
  if (hasFeature(id)) {
    removeFeature(id);
  } else {
    addFeature(id);
  }
}

function add(pid: number) {
  openAddTodoCategory(pid);
}


function update(id: number) {
  openUpdateTodoCategory(id);
}

function remove(id: number, title: string) {
  MessageBoxUtil.confirm("确认删除清单【" + title + '】吗，删除时会将清单下全部待办一并删除', "删除", {
    confirmButtonText: "删除",
    cancelButtonText: "取消"
  }).then(() => useTodoCategoryStore().remove(id)
    .then(() => MessageUtil.success("删除成功"))
    .catch(e => MessageUtil.error("删除失败", e)));

}

/**
 * 检测节点是否允许被释放
 * @param context 上下文
 */
function checkAllowDrop(context: DropContext): boolean {
  return !context.dropNode.data.leaf
}

function onDrop(data: DropContext) {
  if (typeof data.dragNode.value !== 'undefined' &&
    typeof data.dropNode.value !== 'undefined') {
    if (data.dropPosition === 0) {
      useTodoCategoryStore().drop(data.dragNode.value as number, data.dropNode.value as number)
        .then(() => MessageUtil.success("移动成功"))
        .catch(e => MessageUtil.error("移动失败", e));
    } else {
      const target = useTodoCategoryStore().todoCategoryMap.get(data.dropNode.value as number);
      if (!target) {
        return;
      }
      useTodoCategoryStore().drop(data.dragNode.value as number, target.pid)
        .then(() => MessageUtil.success("移动成功"))
        .catch(e => MessageUtil.error("移动失败", e));
    }
  }
}

</script>
<style scoped>
.todo-side {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 269px;
  border-right: 1px solid var(--color-neutral-3);
}
</style>
