<template>
  <t-tooltip v-if="date.status > 0" :content="date.status === 1 ? '未开始' : date.status === 2 ? '进行中' : '已过期'">
    <div class="todo-date ellipsis" :class="[`status-${date.status}`]">
      {{ date.text }}
    </div>
  </t-tooltip>
</template>
<script lang="ts" setup>
import {useTodoDate} from "@/hooks/TodoDate";
import {TodoItemIndex} from "@/entity/todo/TodoItem";

const props = defineProps({
  item: {
    type: Object as PropType<TodoItemIndex>
  }
});

const {onUpdate, date} = useTodoDate(props.item);

watch(() => props.item, () => onUpdate(), {immediate: true, deep: true});
</script>
<script lang="ts">
export default defineComponent({
  name: "TodoDate"
});
</script>
<style scoped lang="less">
.todo-date {
  width: fit-content;
  overflow: auto;
  font-size: var(--td-font-size-body-small);
  text-align: right;

  &.status-1 {
    color: var(--td-text-color-placeholder);
  }

  &.status-2 {
    color: var(--td-brand-color);
  }

  &.status-3 {
    color: var(--td-error-color);
  }
}
</style>
