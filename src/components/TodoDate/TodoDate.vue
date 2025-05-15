<template>
  <t-tooltip v-if="date.status > 0" :content="tooltip">
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

const tooltip = computed(() => {
  if (date.value.tooltip) return date.value.tooltip;
  if (date.value.status === 1) return '未开始';
  else if (date.value.status === 2) return '进行中';
  else if (date.value.status === 3) return '已过期';
  else return '';
})

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
    color: var(--td-text-color-secondary);
  }

  &.status-2 {
    color: var(--td-brand-color);
  }

  &.status-3 {
    color: var(--td-text-color-placeholder);
  }
}
</style>
