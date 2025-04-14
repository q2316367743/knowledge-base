<template>
  <t-dropdown trigger="click" placement="bottom-right" direction="left" :disabled="disabled">
    <t-button variant="text" theme="primary" shape="square">
      <template #icon>
        <filter-sort-icon />
      </template>
    </t-button>
    <t-dropdown-menu>
      <t-dropdown-item value="option-2-2" trigger="hover">
        <template #prefix-icon>
          <usergroup-icon />
        </template>
        分组
        <t-dropdown-menu>
          <t-dropdown-item @click="setTodoList('groupType', TodoCategoryGroupEnum.DEFAULT)">
            <template #prefix-icon>
              <check-icon v-if="groupType === TodoCategoryGroupEnum.DEFAULT" style="color: var(--td-brand-color)"/>
              <minus-icon v-else/>
            </template>
            自定义
          </t-dropdown-item>
          <t-dropdown-item @click="setTodoList('groupType', TodoCategoryGroupEnum.PRIORITY)">
            <template #prefix-icon>
              <check-icon v-if="groupType === TodoCategoryGroupEnum.PRIORITY" style="color: var(--td-brand-color)"/>
              <minus-icon v-else/>
            </template>
            优先级
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown-item>
      <t-dropdown-item value="option-2-2" trigger="hover">
        <template #prefix-icon>
          <filter-sort-icon />
        </template>
        排序
        <t-dropdown-menu>
          <t-dropdown-item @click="setTodoList('todoListSort', TodoListSortEnum.PRIORITY)">
            <template #prefix-icon>
              <check-icon v-if="todoListSort === TodoListSortEnum.PRIORITY" style="color: var(--td-brand-color)"/>
              <minus-icon v-else/>
            </template>
            优先级
          </t-dropdown-item>
          <t-dropdown-item @click="setTodoList('todoListSort', TodoListSortEnum.NAME_ASC)">
            <template #prefix-icon>
              <check-icon v-if="todoListSort === TodoListSortEnum.NAME_ASC" style="color: var(--td-brand-color)"/>
              <minus-icon v-else/>
            </template>
            名称正序
          </t-dropdown-item>
          <t-dropdown-item @click="setTodoList('todoListSort', TodoListSortEnum.NAME_DESC)">
            <template #prefix-icon>
              <check-icon v-if="todoListSort === TodoListSortEnum.NAME_DESC" style="color: var(--td-brand-color)"/>
              <minus-icon v-else/>
            </template>
            名称倒序
          </t-dropdown-item>
          <t-dropdown-item @click="setTodoList('todoListSort', TodoListSortEnum.CREATE_TIME_ASC)">
            <template #prefix-icon>
              <check-icon v-if="todoListSort === TodoListSortEnum.CREATE_TIME_ASC" style="color: var(--td-brand-color)"/>
              <minus-icon v-else/>
            </template>
            创建时间正序
          </t-dropdown-item>
          <t-dropdown-item @click="setTodoList('todoListSort', TodoListSortEnum.CREATE_TIME_DESC)">
            <template #prefix-icon>
              <check-icon v-if="todoListSort === TodoListSortEnum.CREATE_TIME_DESC" style="color: var(--td-brand-color)"/>
              <minus-icon v-else/>
            </template>
            创建时间倒序
          </t-dropdown-item>
        </t-dropdown-menu>
      </t-dropdown-item>
    </t-dropdown-menu>
  </t-dropdown>
</template>
<script lang="ts" setup>
import {CheckIcon, FilterSortIcon, MinusIcon, UsergroupIcon} from "tdesign-icons-vue-next";
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
