<template>
  <div class="todo-info-children">
    <todo-input-for-create @submit="handleSubmit"/>
    <div class="todo-info-children-item" v-for="(item, index) in list" :key="item.id">
      <t-checkbox v-model="list[index].complete" class="flex-auto">{{ item.title }}</t-checkbox>
      <t-popconfirm content="立即删除？" @confirm="list.splice(index,1)">
        <t-button theme="danger" shape="square" size="small" class="ml-8px">
          <template #icon>
            <delete-icon/>
          </template>
        </t-button>
      </t-popconfirm>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoItemChild, TodoItemPriority} from "@/entity/todo/TodoItem";
import TodoInputForCreate from "@/pages/todo/common/TodoInput/TodoInputForCreate.vue";
import {useSnowflake} from "@/hooks/Snowflake";
import {DeleteIcon} from "tdesign-icons-vue-next";

const list = defineModel({
  type: Object as PropType<Array<TodoItemChild>>,
  default: () => ([]),
});

const handleSubmit = (data: { title: string, priority: TodoItemPriority }) => {
  list.value.push({
    id: useSnowflake().nextId(),
    ...data,
    complete: false
  });
}
</script>
<style scoped lang="less">
.todo-info-children {
  .todo-info-children-item {
    padding: 6px 4px;
    border-bottom: 1px solid var(--td-border-level-2-color);
    display: flex;
    align-items: center;
  }
}
</style>
