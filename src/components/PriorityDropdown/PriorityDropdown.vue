<template>
  <!-- 优先级 -->
  <t-dropdown position="br" @select="updatePriority($event)" trigger="click" :disabled="readonly">
    <t-button class="priority" theme="default" :variant="variant" shape="square">
      <template #icon>
        <flag-icon :style="{color:color}"/>
      </template>
    </t-button>
    <t-dropdown-menu>
      <t-dropdown-item :style="{color:handlePriorityColor(TodoItemPriority.HIGH)}"
                       :value="TodoItemPriority.HIGH" @click="priority = TodoItemPriority.HIGH">
        高优先级
      </t-dropdown-item>
      <t-dropdown-item :style="{color:handlePriorityColor(TodoItemPriority.MIDDLE)}"
                       :value="TodoItemPriority.MIDDLE" @click="priority = TodoItemPriority.MIDDLE">
        中优先级
      </t-dropdown-item>
      <t-dropdown-item :style="{color:handlePriorityColor(TodoItemPriority.FLOOR)}"
                       :value="TodoItemPriority.FLOOR" @click="priority = TodoItemPriority.FLOOR">
        低优先级
      </t-dropdown-item>
      <t-dropdown-item :style="{color:handlePriorityColor(TodoItemPriority.NONE)}"
                       :value="TodoItemPriority.NONE" @click="priority = TodoItemPriority.NONE">
        无优先级
      </t-dropdown-item>
    </t-dropdown-menu>
  </t-dropdown>

</template>
<script lang="ts" setup>
import {FlagIcon} from "tdesign-icons-vue-next";
import {handlePriorityColor, TodoItemPriority} from "@/entity/todo/TodoItem";

const priority = defineModel({
  type: Number as PropType<TodoItemPriority>,
  default: TodoItemPriority.NONE
});
defineProps({
  variant: {
    type: String as PropType<'text' | 'outline'>,
    default: 'text'
  },
  readonly: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits(['change']);

const color = computed(() => handlePriorityColor(priority.value));

function updatePriority(value: any) {
  priority.value = value;
  emit('change');
}
</script>
<style scoped lang="less">

</style>
