<template>
  <div class="empty-todo">
    <header class="empty-todo-header">
      <div class="empty-todo-header__top">
        <div class="empty-todo-header__left">
          <t-button variant="text" theme="primary" shape="square" @click="switchCollapsed()">
            <template #icon>
              <menu-fold-icon v-if="collapsed"/>
              <menu-unfold-icon v-else/>
            </template>
          </t-button>
        </div>
      </div>
    </header>
    <main class="empty-todo-main">
      <slot/>
    </main>
  </div>
</template>

<script lang="ts" setup>
import {MenuFoldIcon, MenuUnfoldIcon} from "tdesign-icons-vue-next";
import {TodoItemStatus} from "@/entity/todo/TodoItem";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import TodoHeaderOrder from "@/pages/todo/common/TodoHeader/TodoHeaderOrder.vue";
import TodoHeaderMore from "@/pages/todo/common/TodoHeader/TodoHeaderMore.vue";

const collapsed = computed(() => useTodoWrapStore().collapsed);
const switchCollapsed = () => useTodoWrapStore().switchCollapsed();
</script>
<script lang="ts">
export default defineComponent({
  name: 'EmptyTodo',
});
</script>
<style scoped lang="less">
.empty-todo {
  position: relative;
  width: 100%;
  height: 100%;

  .empty-todo-header {
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
  }

  .empty-todo-main {
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

</style>