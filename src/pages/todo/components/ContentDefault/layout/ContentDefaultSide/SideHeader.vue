<template>
  <div class="header-wrap">
    <todo-header side/>
    <a-input v-model="titleWrap" allow-clear class="input" :placeholder="placeholder" @keydown.enter="submit()"
             :disabled="id === 0">
      <template #suffix>
        <!-- 优先级 -->
        <a-dropdown position="br" @select="updatePriority($event)" :disabled="disabled">
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
    </a-input>
  </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
// 存储
import {useTodoStore} from "@/store/components/TodoStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
// 实体类
import {getDefaultTodoCategory} from "@/entity/todo/TodoCategory";
import {handlePriorityColor, TodoItemPriority} from "@/entity/todo/TodoItem";
// 组件
import TodoHeader from "@/pages/todo/components/common/TodoHeader.vue";

const id = computed(() => useTodoStore().id);
const placeholder = computed(() => {
  if (id.value === 0) {
    return '';
  }
  if (useTodoStore().title.length > 0) {
    return `添加任务到“${useTodoStore().title}”，回车即可创建`;
  } else {
    return '';
  }
});
const disabled = computed(() => useTodoStore().id === 0);

const titleWrap = ref("");
const priority = ref<TodoItemPriority>(TodoItemPriority.NONE);
const todoListSort = ref<TodoListSortEnum>(TodoListSortEnum.PRIORITY);

const color = computed(() => handlePriorityColor(priority.value));

watch(() => useTodoStore().id, value => getTodoListSort(value), {immediate: true});

function getTodoListSort(id: number) {
  if (id === 0) {
    todoListSort.value = TodoListSortEnum.PRIORITY;
    return;
  }
  const category = useTodoCategoryStore().todoCategoryMap.get(id);
  if (category) {
    todoListSort.value = getDefaultTodoCategory(category).todoListSort;
  }
}

function submit() {
  useTodoStore().addSimple({
    title: titleWrap.value,
    priority: priority.value
  }).then(() => {
    MessageUtil.success("新增成功");
    titleWrap.value = '';
    priority.value = TodoItemPriority.NONE;
  }).catch(e => MessageUtil.error("新增失败", e))
}

function updatePriority(value: any) {
  priority.value = value;
}

</script>
<style lang="less">
.header-wrap {
  position: relative;
  width: 100%;

  .header {
    display: grid;
    height: 32px;
    padding: 7px 7px 0;
    grid-template-columns: 32px 1fr 64px;

    .title {
      margin-left: 7px;
      line-height: 32px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .input {
    width: calc(100% - 14px);
    margin: 7px 7px;
    padding-right: 0;

    .arco-input-suffix {
      padding-left: 0;
    }
  }
}
</style>
