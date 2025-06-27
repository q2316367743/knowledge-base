<template>
  <t-input v-model="title" :clearable="true" class="input" :placeholder="placeholder" @enter="submit()"
           :disabled>
    <template #prefix-icon>
      <!-- 优先级 -->
      <priority-dropdown v-model="priority" size="small"/>
    </template>
  </t-input>
</template>
<script lang="ts" setup>
import {TodoItemPriority} from "@/entity/todo/TodoItem";

defineProps({
  placeholder: String,
  disabled: Boolean,
});
const emit = defineEmits(['submit']);

const title = ref("");
const priority = ref<TodoItemPriority>(TodoItemPriority.NONE);

function submit() {
  emit("submit", {
    priority: priority.value,
    title: title.value,
  });
  title.value = '';
  priority.value = TodoItemPriority.NONE;
}
</script>
<style scoped lang="less">

</style>
