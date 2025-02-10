<template>
  <header class="todo-header">
    <div class="todo-header__top">
      <div class="todo-header__left">
        <a-button type="text" @click="switchCollapsed()">
          <template #icon>
            <icon-menu/>
          </template>
        </a-button>
        <div class="title">{{ title }}</div>
      </div>
      <div class="todo-header__right">
        <div class="todo-header__progress" v-if="!side">
          <a-progress :percent="percent"/>
        </div>
        <a-button-group type="text">
          <!-- 排序 -->
          <a-dropdown position="br" @select="setTodoListSort($event)" :disabled="disabled">
            <a-button>
              <template #icon>
                <icon-sort/>
              </template>
            </a-button>
            <template #content>
              <a-doption :value="TodoListSortEnum.PRIORITY">
                <template #icon>
                  <icon-check v-if="todoListSort === TodoListSortEnum.PRIORITY"/>
                  <a-icon v-else/>
                </template>
                优先级
              </a-doption>
              <a-doption :value="TodoListSortEnum.NAME_ASC">
                <template #icon>
                  <icon-check v-if="todoListSort === TodoListSortEnum.NAME_ASC"/>
                  <a-icon v-else/>
                </template>
                名称正序
              </a-doption>
              <a-doption :value="TodoListSortEnum.NAME_DESC">
                <template #icon>
                  <icon-check v-if="todoListSort === TodoListSortEnum.NAME_DESC"/>
                  <a-icon v-else/>
                </template>
                名称倒序
              </a-doption>
              <a-doption :value="TodoListSortEnum.CREATE_TIME_ASC">
                <template #icon>
                  <icon-check v-if="todoListSort === TodoListSortEnum.CREATE_TIME_ASC"/>
                  <a-icon v-else/>
                </template>
                创建时间正序
              </a-doption>
              <a-doption :value="TodoListSortEnum.CREATE_TIME_DESC">
                <template #icon>
                  <icon-check v-if="todoListSort === TodoListSortEnum.CREATE_TIME_DESC"/>
                  <a-icon v-else/>
                </template>
                创建时间倒序
              </a-doption>
            </template>
          </a-dropdown>
          <!-- 更多 -->
          <a-dropdown position="br">
            <a-button>
              <template #icon>
                <icon-more-vertical/>
              </template>
            </a-button>
            <template #content>
              <a-doption :disabled="disabled" @click="openTodoExport()">
                <template #icon>
                  <icon-export/>
                </template>
                导出
              </a-doption>
              <a-doption :disabled="disabled" @click="openAddRelationArticle()">
                <template #icon>
                  <icon-relation/>
                </template>
                关联文章
              </a-doption>
              <a-doption :disabled="disabled" @click="todoSearch()">
                <template #icon>
                  <icon-search/>
                </template>
                搜索
              </a-doption>
              <a-doption :disabled="disabled" @click="openTodoSetting()">
                <template #icon>
                  <icon-settings/>
                </template>
                设置
              </a-doption>
              <a-divider :margin="2"/>
              <a-doption :disabled="disabled" @click="openEditTodoGroupFunc('0', '', [])">
                <template #icon>
                  <icon-plus/>
                </template>
                添加分组
              </a-doption>
            </template>
          </a-dropdown>
        </a-button-group>
      </div>
    </div>
    <div class="todo-header__bottom" v-if="side">
      <a-progress :percent="percent"/>
    </div>
  </header>
</template>
<script lang="ts" setup>
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {computed} from "vue";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {openTodoExport} from "@/pages/todo/components/common/TodoExport";
import {openTodoSetting} from "@/pages/todo/components/common/TodoSetting";
import {openAddRelationArticle} from "@/pages/todo/components/common/AddRelationArticle";
import {todoSearch} from "@/pages/todo/components/common/TodoSearch";
import {openEditTodoGroupFunc} from "@/pages/todo/components/func/TodoGroupFunc";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import {TodoItemStatus} from "@/entity/todo/TodoItem";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";

defineProps({
  side: {
    type: Boolean,
    default: false
  }
});

const disabled = computed(() => useTodoWrapStore().categoryId === 0);
const title = computed(() => useTodoWrapStore().currentCategory?.name);
const todoListSort = computed<TodoListSortEnum>(() => useTodoWrapStore().sort);

const percent = computed(() => {
  const {items} = useTodoItemStore();
  if (items.length === 0) {
    return 0;
  }
  const all = items.length;
  const value = items.filter(e => e.status === TodoItemStatus.ABANDON || e.status === TodoItemStatus.COMPLETE).length;
  return parseFloat((value / all).toFixed(4))
});

const switchCollapsed = () => useTodoWrapStore().switchCollapsed();
const setTodoListSort = (value: any) => {
  const {categoryId} = useTodoWrapStore();
  if (categoryId === 0) {
    return;
  }
  useTodoCategoryStore()
    .update(categoryId, {todoListSort: value})
    // 更新成功，刷新数据
    .then(() => useTodoWrapStore().init(categoryId))
    .catch(e => MessageUtil.error("更新待办列表排序异常", e));
}
</script>
<style scoped lang="less">
.todo-header {
  padding: 7px;

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__left {
    display: flex;
    align-items: center;
  }

  &__right {
    display: flex;
    align-items: center;
  }

  &__progress {
    width: 200px;
    margin-top: -5px;
    margin-right: 15px;
  }

  &__bottom {
    width: 100%;
    margin-bottom: 5px;
  }

  :deep(.arco-progress-line-text) {
    margin-left: 0;
  }

  .title {
    margin-left: 7px;
    line-height: 32px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
