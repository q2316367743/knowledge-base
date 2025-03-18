<template>
  <!-- 优先级 -->
  <t-dropdown position="br" @select="updatePriority($event)" trigger="click">
    <t-button :style="{color: color}" class="priority" theme="default" :variant="variant" shape="square">
      <template #icon>
        <icon-thunderbolt/>
      </template>
    </t-button>
    <t-dropdown-menu>
      <t-dropdown-item :style="{color:handlePriorityColor(TodoItemPriority.HIGH)}"
                       :value="TodoItemPriority.HIGH">
        高优先级
      </t-dropdown-item>
      <t-dropdown-item :style="{color:handlePriorityColor(TodoItemPriority.MIDDLE)}"
                       :value="TodoItemPriority.MIDDLE">
        中优先级
      </t-dropdown-item>
      <t-dropdown-item :style="{color:handlePriorityColor(TodoItemPriority.FLOOR)}"
                       :value="TodoItemPriority.FLOOR">
        低优先级
      </t-dropdown-item>
      <t-dropdown-item :style="{color:handlePriorityColor(TodoItemPriority.NONE)}"
                       :value="TodoItemPriority.NONE">
        无优先级
      </t-dropdown-item>
    </t-dropdown-menu>
  </t-dropdown>

</template>
<script lang="ts" setup>
import {handlePriorityColor, TodoItemPriority} from "@/entity/todo/TodoItem";
import {computed} from "vue";
import {Dropdown as ADropdown, Doption as ADoption, Button as AButton} from "@arco-design/web-vue";
import {IconThunderbolt} from "@arco-design/web-vue/es/icon";

const priority = defineModel({
  type: Number as PropType<TodoItemPriority>,
  default: TodoItemPriority.NONE
});
defineProps({
  variant: {
    type: String as PropType< 'text' | 'outline'>,
    default: 'text'
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
