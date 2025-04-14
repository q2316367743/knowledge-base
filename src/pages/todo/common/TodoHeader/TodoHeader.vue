<template>
  <header class="todo-header">
    <div class="todo-header__top">
      <div class="todo-header__left">
        <t-button variant="text" theme="primary" shape="square" @click="switchCollapsed()">
          <template #icon>
            <menu-fold-icon v-if="collapsed"/>
            <menu-unfold-icon v-else/>
          </template>
        </t-button>
        <div class="title">{{ title }}</div>
      </div>
      <div class="todo-header__right">
        <div class="todo-header__progress" v-if="!side">
          <t-progress :percentage="percent"/>
        </div>
        <div class="flex">
          <!-- 排序 -->
          <todo-header-order/>
          <!-- 更多 -->
          <todo-header-more />
        </div>
      </div>
    </div>
    <div class="todo-header__bottom" v-if="side">
      <t-progress :percentage="percent"/>
    </div>
  </header>
</template>
<script lang="ts" setup>
import {MenuFoldIcon, MenuUnfoldIcon} from "tdesign-icons-vue-next";
import {TodoItemStatus} from "@/entity/todo/TodoItem";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import TodoHeaderOrder from "@/pages/todo/common/TodoHeader/TodoHeaderOrder.vue";
import TodoHeaderMore from "@/pages/todo/common/TodoHeader/TodoHeaderMore.vue";

defineProps({
  side: {
    type: Boolean,
    default: false
  }
});

const title = computed(() => useTodoWrapStore().currentCategory?.name);
const collapsed = computed(() => useTodoWrapStore().collapsed);

const percent = computed(() => {
  const {items} = useTodoItemStore();
  if (items.length === 0) {
    return 0;
  }
  const all = items.length;
  const value = items.filter(e => e.status === TodoItemStatus.ABANDON || e.status === TodoItemStatus.COMPLETE).length;
  console.log(value, all)
  return Math.round(value / all * 100)
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
