<template>
  <div class="todo-item-priority" v-if="priorityView">
    <div class="todo-item-priority__header" @click="toggleVisible()">
      <div class="todo-item-priority__header-left">
        <div class="todo-item-priority__header-handle">
          <icon-down :style="{transform: visible ? '' : 'rotate(-90deg)'}"/>
        </div>
        <div class="todo-item-priority__header-title">{{ priorityView.label }}</div>
        <div class="todo-item-priority__header-count">{{ priorityView.children.length }}</div>
      </div>
      <div class="todo-item-priority__header-plus">
        <a-button type="text" size="mini" @click.stop>
          <template #icon>
            <icon-plus/>
          </template>
        </a-button>
      </div>
    </div>
    <div class="todo-content-priority__content" :style="{height: visible ? '100%' : '0px'}">
      <card-todo-item v-for="item in priorityView.children" :key="item.id" :item="item" :data-id="item.id" attr/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoGroupPriorityView} from "@/entity/todo/TodoGroup";
import CardTodoItem from "@/pages/todo/components/common/CardTodoItem.vue";

defineProps({
  priorityView: {
    type: Object as PropType<TodoGroupPriorityView>,
  }
});
const visible = ref(true);

const toggleVisible = useToggle(visible);
</script>
<style scoped lang="less">
.todo-item-priority {

  &__header {
    display: flex;
    justify-content: space-between;
    margin: 4px 4px 8px;
    cursor: pointer;
    user-select: none;
    width: calc(100% - 12px);
    align-items: center;
    transition: opacity 0.3s;

    .todo-item-priority__header-left {
      display: flex;
      height: 24px;
      align-items: center;


      .todo-item-priority__header-handle {
        color: var(--color-text-2);

        :deep(.arco-icon) {
          transition: 0.3s;
        }
      }

      .todo-item-priority__header-title {
        margin: 0 8px;
        font-size: 0.9rem;
        font-weight: bold;
      }

      .todo-item-priority__header-count {
        color: var(--color-text-2);
      }
    }

    .todo-item-priority__header-plus {
      opacity: 0;
    }

    &:hover {
      .todo-item-priority__header-plus {
        opacity: 1;
      }
    }

  }

  &__content {
    transition: height 0.3s;
  }
}
</style>
