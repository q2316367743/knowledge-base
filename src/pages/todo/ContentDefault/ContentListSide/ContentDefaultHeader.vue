<template>
  <div class="header-wrap">
    <todo-header side/>
    <t-input v-model="titleWrap" :clearable="true" class="input" :placeholder="placeholder" @enter="submit()"
             :disabled>
      <template #suffix>
        <!-- 优先级 -->
        <priority-dropdown v-model="priority"/>
      </template>
    </t-input>
  </div>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import MessageUtil from "@/utils/modal/MessageUtil";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
// 存储
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
// 实体类
import {getDefaultTodoCategory} from "@/entity/todo/TodoCategory";
import {TodoItemPriority} from "@/entity/todo/TodoItem";
// 组件
import TodoHeader from "@/pages/todo/common/TodoHeader/TodoHeader.vue";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";

const id = computed(() => useTodoWrapStore().categoryId);
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
const disabled = computed(() => useTodoWrapStore().categoryId === 0);

const titleWrap = ref("");
const priority = ref<TodoItemPriority>(TodoItemPriority.NONE);
const todoListSort = ref<TodoListSortEnum>(TodoListSortEnum.PRIORITY);

watch(() => useTodoWrapStore().categoryId, value => getTodoListSort(value), {immediate: true});

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
