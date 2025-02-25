<template>
  <a-dropdown position="br" :disabled="disabled">
    <a-button>
      <template #icon>
        <icon-sort/>
      </template>
    </a-button>
    <template #content>
      <a-dsubmenu value="option-2-2" trigger="hover">
        <template #icon>
          <icon-user-group/>
        </template>
        分组
        <template #content>
          <a-doption @click="setTodoList('groupType', TodoCategoryGroupEnum.DEFAULT)">
            <template #icon>
              <icon-check v-if="groupType === TodoCategoryGroupEnum.DEFAULT"/>
              <a-icon v-else/>
            </template>
            自定义
          </a-doption>
          <a-doption @click="setTodoList('groupType', TodoCategoryGroupEnum.PRIORITY)">
            <template #icon>
              <icon-check v-if="groupType === TodoCategoryGroupEnum.PRIORITY"/>
              <a-icon v-else/>
            </template>
            优先级
          </a-doption>
        </template>
      </a-dsubmenu>
      <a-dsubmenu value="option-2-2" trigger="hover">
        <template #icon>
          <icon-sort/>
        </template>
        排序
        <template #content>
          <a-doption @click="setTodoList('todoListSort', TodoListSortEnum.PRIORITY)">
            <template #icon>
              <icon-check v-if="todoListSort === TodoListSortEnum.PRIORITY"/>
              <a-icon v-else/>
            </template>
            优先级
          </a-doption>
          <a-doption @click="setTodoList('todoListSort', TodoListSortEnum.NAME_ASC)">
            <template #icon>
              <icon-check v-if="todoListSort === TodoListSortEnum.NAME_ASC"/>
              <a-icon v-else/>
            </template>
            名称正序
          </a-doption>
          <a-doption @click="setTodoList('todoListSort', TodoListSortEnum.NAME_DESC)">
            <template #icon>
              <icon-check v-if="todoListSort === TodoListSortEnum.NAME_DESC"/>
              <a-icon v-else/>
            </template>
            名称倒序
          </a-doption>
          <a-doption @click="setTodoList('todoListSort', TodoListSortEnum.CREATE_TIME_ASC)">
            <template #icon>
              <icon-check v-if="todoListSort === TodoListSortEnum.CREATE_TIME_ASC"/>
              <a-icon v-else/>
            </template>
            创建时间正序
          </a-doption>
          <a-doption @click="setTodoList('todoListSort', TodoListSortEnum.CREATE_TIME_DESC)">
            <template #icon>
              <icon-check v-if="todoListSort === TodoListSortEnum.CREATE_TIME_DESC"/>
              <a-icon v-else/>
            </template>
            创建时间倒序
          </a-doption>
        </template>
      </a-dsubmenu>
    </template>
  </a-dropdown>
</template>
<script lang="ts" setup>
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {TodoCategory, TodoCategoryGroupEnum} from "@/entity/todo/TodoCategory";

const todoListSort = computed<TodoListSortEnum>(() => useTodoWrapStore().sort);
const groupType = computed<TodoCategoryGroupEnum>(() => useTodoWrapStore().groupType);
const disabled = computed(() => useTodoWrapStore().categoryId === 0);

const setTodoList = <K extends keyof TodoCategory, V extends TodoCategory[K]>(k: K, v: V) => {
  const {categoryId} = useTodoWrapStore();
  if (categoryId === 0) {
    return;
  }
  const target = {} as Partial<TodoCategory>
  target[k] = v;
  useTodoCategoryStore()
    .update(categoryId, target)
    // 更新成功，刷新数据
    .then(() => useTodoWrapStore().init(categoryId))
    .catch(e => MessageUtil.error("更新待办列表排序异常", e));
}
</script>
<style scoped lang="less">

</style>
