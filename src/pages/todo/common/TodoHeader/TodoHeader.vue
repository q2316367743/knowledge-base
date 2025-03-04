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
          <todo-header-order />
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
                关联笔记
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
              <a-doption :disabled="disabled" @click="openEditTodoGroupFunc()">
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
import {openTodoExport} from "@/pages/todo/common/TodoExport";
import {openTodoSetting} from "@/pages/todo/common/TodoSetting";
import {openAddRelationArticle} from "@/pages/todo/common/AddRelationArticle";
import {todoSearch} from "@/pages/todo/common/TodoSearch";
import {openEditTodoGroupFunc} from "@/pages/todo/common/TodoGroupFunc";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import {TodoItemStatus} from "@/entity/todo/TodoItem";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import TodoHeaderOrder from "@/pages/todo/common/TodoHeader/TodoHeaderOrder.vue";

defineProps({
  side: {
    type: Boolean,
    default: false
  }
});

const disabled = computed(() => useTodoWrapStore().categoryId === 0);
const title = computed(() => useTodoWrapStore().currentCategory?.name);

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
