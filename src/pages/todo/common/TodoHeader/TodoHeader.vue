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
        <t-radio-group size="small" variant="default-filled" v-model="view">
          <t-radio-button value="list">待办</t-radio-button>
          <t-radio-button value="note">笔记</t-radio-button>
        </t-radio-group>
      </div>
      <div class="todo-header__right">
        <div class="todo-header__progress" v-if="!side">
          <t-progress :percentage="percent"/>
        </div>
        <div class="flex">
          <!-- 排序 -->
          <todo-header-order/>
          <!-- 更多 -->
          <todo-header-more/>
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
import {ITodoInstance, TodoInstance} from "@/pages/todo/types";

defineProps({
  side: {
    type: Boolean,
    default: false
  }
});

const ij = inject<ITodoInstance>(TodoInstance);

const view = ref(ij ?  ij.getView() : 'list');
const title = computed(() => useTodoWrapStore().currentCategory?.name);
const collapsed = computed(() => useTodoWrapStore().collapsed);

const percent = computed(() => {
  const {items} = useTodoItemStore();
  if (items.length === 0) {
    return 0;
  }
  const all = items.length;
  const value = items.filter(e => e.status === TodoItemStatus.ABANDON || e.status === TodoItemStatus.COMPLETE).length;
  return Math.round(value / all * 100)
});

const switchCollapsed = () => useTodoWrapStore().switchCollapsed();

watch(view, value => ij?.setView(value));

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
    margin: 8px;
    line-height: 24px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    border-right: 1px solid var(--td-border-level-2-color);
    padding-right: 8px;
  }
}
</style>
