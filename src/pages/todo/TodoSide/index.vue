<template>
  <div class="todo-side">
    <header class="flex justify-between items-center p-4px pl-8px"
            style="border-bottom: 1px solid var(--td-border-level-2-color)">
      <div style="font-size: var(--td-font-size-body-large);font-weight: bold;">待办</div>
      <t-button theme="primary" shape="square" @click="add(0)">
        <template #icon>
          <plus-icon/>
        </template>
      </t-button>
    </header>
    <t-tree :actived="selectKeys" :data="todoCategoryTree" :line="true" :activable="true" :draggable="true"
            :style="{margin: '7px',width:' calc(100% - 14px)', height: virtualHeight}" :scroll="{type: 'virtual'}"
            :allow-drop="checkAllowDrop" @drop="onDrop($event)" v-model:expanded="expanded">
      <template #label="{node}">
        <div class="flex items-center w-full" @click="onClick({node, e: $event})"
             @contextmenu="onContextmenu(node, $event)">
          <list-icon v-if="node.data.leaf"/>
          <folder-icon v-else/>
          <span class="text-ellipsis ml-8px" :title="node.label">{{ node.label }}</span>
        </div>
      </template>
      <template #operations="{node}">
        <t-button variant="text" theme="primary" shape="square" @click.stop="onContextmenu(node, $event)">
          <template #icon>
            <more-icon/>
          </template>
        </t-button>
      </template>
    </t-tree>
  </div>
</template>
<script lang="ts" setup>
import {
  FolderIcon,
  ListIcon,
  MoreIcon,
  PlusIcon,
} from "tdesign-icons-vue-next";
import {TreeNodeModel} from "tdesign-vue-next";
import MessageUtil from "@/utils/modal/MessageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useUtoolsDbStorage} from "@/hooks/UtoolsDbStorage";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {useBaseSettingStore} from "@/store/setting/BaseSettingStore";
import {openAddTodoCategory} from "@/pages/todo/TodoSide/AddTodoCategory";
import {onContextmenuForTodo} from "@/pages/todo/TodoSide/ContextmenuForTodo";
import {TodoCategory, TodoCategoryOpenTypeEnum, TodoCategoryTypeEnum} from "@/entity/todo/TodoCategory";

interface DropContext {
  e: DragEvent;
  dragNode: TreeNodeModel;
  dropNode: TreeNodeModel;
  // 拖拽位置，0: 内，-1：上，1：下
  dropPosition: number;
}

const size = useWindowSize();

const expanded = useUtoolsDbStorage<Array<string | number>>(LocalNameEnum.KEY_TODO_EXPANDED, []);

const selectKeys = computed(() => ([useTodoWrapStore().categoryId]));

const todoCategoryTree = computed(() => useTodoCategoryStore().todoCategoryTree);
const virtualHeight = computed(() => (size.height.value - 56) + 'px');

function onOpen(categoryId: number, category: TodoCategory, widget = false) {
  if (categoryId !== useTodoWrapStore().categoryId || widget) {
    useTodoWrapStore().init(categoryId, widget || category.openType === TodoCategoryOpenTypeEnum.WIDGET);
  }
  if (useBaseSettingStore().autoCollapsedByTodo) {
    useTodoWrapStore().switchCollapsed(true);
  }
}

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
    onOpen(categoryId, category)
  } else {
    useTodoWrapStore().init(0);
  }

}

function onContextmenu(node: TreeNodeModel, e: MouseEvent) {
  const categoryId = node.value as number;
  const category = useTodoCategoryStore().todoCategoryMap.get(categoryId);
  if (!category) {
    return;
  }
  const children = node.getChildren(false);
  let childLength = 0;
  if (Array.isArray(children)) {
    childLength = children.length;
  }
  onContextmenuForTodo({
    e,
    childLength,
    id: categoryId,
    onOpen: () => onOpen(categoryId, category),
    onOpenWidget: () => onOpen(categoryId, category, true)
  })
}

function add(pid: number) {
  openAddTodoCategory(pid);
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
  border-right: 1px solid var(--td-border-level-2-color);
}
</style>
