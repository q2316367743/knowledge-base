<template>
  <div v-if="item" class="content-default-item"
       :class="itemId === item.id ? 'active' : ''"
       :key="item.id" @click.stop>
    <todo-item-checkbox :priority="item.priority" :status="item.status"
                        @click.stop="updateStatus(item.id, item.status)"/>
    <div class="title" @click="setItemId(item.id)" :style="{color: handleColor(item)}"
         @contextmenu="onContentDefaultItem($event, item)">
      {{ item.title }}
    </div>
    <a-tooltip :content="(item.top? '取消': '') + '置顶'" position="right">
      <t-button theme="primary" variant="text" shape="square"
                :style="{color: item.top ? 'rgb(var(--orange-6))' : 'var(--color-neutral-4)'}"
                @click="updateTop(item.id, !item.top)">
        <template #icon>
          <icon-arrow-rise/>
        </template>
      </t-button>
    </a-tooltip>
  </div>
</template>
<script lang="ts" setup>
import {
  getNextTodoItemStatus,
  handlePriorityColor,
  TodoItemIndex,
  TodoItemPriority,
  TodoItemStatus
} from "@/entity/todo/TodoItem";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {useGlobalStore} from "@/store/GlobalStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useUmami} from "@/plugin/umami";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {onContentDefaultItem} from "@/pages/todo/ContentDefault/components/ContentDefaultItem";

defineProps({
  item: {
    type: Object as PropType<TodoItemIndex>
  }
});

const itemId = computed(() => useTodoWrapStore().itemId);
const setItemId = (e: number) => useTodoWrapStore().setItemId(e);
const handleColor = (item: TodoItemIndex): string => {
  if (item.status === TodoItemStatus.COMPLETE || item.status === TodoItemStatus.ABANDON) {
    return 'var(--color-text-1)';
  }
  return handlePriorityColor(item.priority);
};

const updateTop = (id: number, top: boolean) => useTodoItemStore().updateById(id, {top})
  .then(() => MessageUtil.success(top ? "已置顶" : "取消置顶"))
  .catch(e => MessageUtil.error((top ? "置顶" : "取消置顶") + "失败", e));

function updateStatus(itemId: number, status: TodoItemStatus) {
  useTodoItemStore().updateById(itemId, {status: getNextTodoItemStatus(status)})
    .then(record => {
      if (record.status === TodoItemStatus.COMPLETE) {
        MessageUtil.success(`【${record.title}】已完成`);
        useUmami.track('/待办/状态/完成');
      } else if (record.status === TodoItemStatus.ABANDON) {
        useUmami.track('待办/状态/放弃');
      }
    })
    .catch(e => MessageUtil.error("更新失败", e));
}

function updatePriority(id: number, priority: TodoItemPriority) {
  useGlobalStore().startLoading("开始更新待办项");
  useTodoItemStore().updateById(id, {priority})
    .then(() => MessageUtil.success("更新成功"))
    .catch(e => MessageUtil.error("更新失败", e))
    .finally(() => useGlobalStore().closeLoading());
}

async function _updateStatusToAbandon(itemId: number): Promise<TodoItemIndex> {
  // 实时查询
  const attr = await useTodoItemStore().getTodoItemAttr(itemId);
  const reason = await MessageBoxUtil.prompt("请输入放弃原因", "放弃待办", {
    confirmButtonText: "放弃",
    cancelButtonText: "取消",
    inputValue: attr.reason
  });
  const record = await useTodoItemStore()
    .updateById(itemId, {status: TodoItemStatus.ABANDON}, {reason})
  return Promise.resolve(record);
}

function updateStatusToAbandon(itemId: number) {
  useGlobalStore().startLoading("开始更新待办项");
  _updateStatusToAbandon(itemId)
    .then(record => {
      if (record.status === TodoItemStatus.COMPLETE) {
        MessageUtil.success(`【${record.title}】已完成`)
      }
    })
    .catch(e => {
      MessageUtil.error("更新失败", e)
    })
    .finally(() => useGlobalStore().closeLoading());
}

function removeById(id: number) {
  MessageBoxUtil.confirm("是否删除该待办项？", "删除提示", {
    confirmButtonText: "删除"
  }).then(() => {
    useGlobalStore().startLoading("开始删除待办项");
    useTodoItemStore().deleteById(id)
      .then(() => MessageUtil.success("删除成功"))
      .catch(e => MessageUtil.error("删除失败", e))
      .finally(() => useGlobalStore().closeLoading());
  })
}
</script>
<style scoped lang="less">
.content-default-item {
  position: relative;
  padding: 4px 7px;
  border-bottom: 1px solid var(--color-neutral-3);
  display: grid;
  grid-template-columns: 30px 1fr 32px;
  height: 32px;
  line-height: 32px;
  cursor: pointer;

  &:last-child {
    border-bottom: 1px solid transparent;
  }

  &:hover {
    background-color: var(--color-fill-3);
  }

  &.active {
    background-color: var(--color-fill-3);
  }

  .extra {
    color: rgb(var(--orange-6));

    &.disabled {
      color: var(--color-neutral-4);
    }
  }

  .gray {
    color: var(--color-neutral-6);
  }

  .delete {
    text-decoration: line-through
  }

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
