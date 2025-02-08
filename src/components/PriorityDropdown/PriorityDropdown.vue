<template>
  <!-- 优先级 -->
  <a-dropdown position="br" @select="updatePriority($event)">
    <a-button type="text" :style="{color: color}" class="priority">
      <template #icon>
        <icon-thunderbolt/>
      </template>
    </a-button>
    <template #content>
      <a-doption :style="{color:handlePriorityColor(TodoItemPriority.HIGH)}"
                 :value="TodoItemPriority.HIGH">
        高优先级
      </a-doption>
      <a-doption :style="{color:handlePriorityColor(TodoItemPriority.MIDDLE)}"
                 :value="TodoItemPriority.MIDDLE">
        中优先级
      </a-doption>
      <a-doption :style="{color:handlePriorityColor(TodoItemPriority.FLOOR)}"
                 :value="TodoItemPriority.FLOOR">
        低优先级
      </a-doption>
      <a-doption :style="{color:handlePriorityColor(TodoItemPriority.NONE)}"
                 :value="TodoItemPriority.NONE">
        无优先级
      </a-doption>
    </template>
  </a-dropdown>
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

const color = computed(() => handlePriorityColor(priority.value));

function updatePriority(value: any) {
  priority.value = value;
}
</script>
<style scoped lang="less">

</style>
