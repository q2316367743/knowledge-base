<template>
  <t-input v-model="titleWrap" :clearable="true" class="input" :placeholder="placeholder" @enter="submit()"
           :disabled="id === 0">
    <template #suffix>
      <!-- 优先级 -->
      <t-dropdown placement="bottom-right" @select="updatePriority($event)" :disabled="disabled">
        <t-button theme="primary" shape="square" variant="text" :style="{color: color}" class="priority">
          <template #icon>
            <flag-icon/>
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
  </t-input>
</template>
<script lang="ts" setup>
import {handlePriorityColor, TodoItemPriority} from "@/entity/todo/TodoItem";
import {computed, ref} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {FlagIcon} from "tdesign-icons-vue-next";


const titleWrap = ref("");
const priority = ref<TodoItemPriority>(TodoItemPriority.NONE);

const id = computed(() => useTodoWrapStore().categoryId);
const disabled = computed(() => useTodoWrapStore().categoryId === 0);
const color = computed(() => handlePriorityColor(priority.value));
const placeholder = computed(() => {
  if (id.value === 0) {
    return '';
  }
  const {currentCategory} = useTodoWrapStore();
  if (currentCategory) {
    return `添加任务到“${currentCategory.name}”，回车即可创建`;
  } else {
    return '';
  }
});

function updatePriority(value: any) {
  priority.value = value;
}

function submit() {
  useTodoWrapStore().addItem({
    title: titleWrap.value,
    priority: priority.value
  }, {}).then(() => {
    MessageUtil.success("新增成功");
    titleWrap.value = '';
    priority.value = TodoItemPriority.NONE;
  }).catch(e => MessageUtil.error("新增失败", e))
}

</script>
<style scoped>

</style>
