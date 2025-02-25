<template>
  <a-doption :style="{color:handlePriorityColor(priority)}" :value="priority">{{ text }}</a-doption>
</template>
<script lang="ts" setup>
import {handlePriorityColor, TodoItemPriority} from "@/entity/todo/TodoItem";

defineProps({
  priority: {
    type: Number as PropType<TodoItemPriority>,
    default: TodoItemPriority.NONE
  },
  text: {
    type: String,
    default: ''
  }
});
</script>
<style scoped lang="less">

</style>
