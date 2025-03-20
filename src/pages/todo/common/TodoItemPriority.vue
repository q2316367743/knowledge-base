<template>
  <div class="todo-item-priority" v-show="todoItems.length > 0">
    <div class="todo-item-priority__header" @click="toggleVisible()">
      <div class="todo-item-priority__header-left">
        <div class="todo-item-priority__header-handle">
          <icon-down :style="{transform: visible ? '' : 'rotate(-90deg)'}"/>
        </div>
        <div class="todo-item-priority__header-title">{{ label }}</div>
        <div class="todo-item-priority__header-count">{{ todoItems.length }}</div>
      </div>
      <div class="todo-item-priority__header-plus">
        <a-button type="text" size="mini" @click.stop="openAddTodoItem({group, priority: priorityView?.value})">
          <template #icon>
            <icon-plus/>
          </template>
        </a-button>
      </div>
    </div>
    <div class="todo-content-priority__content" v-show="visible">
      <card-todo-item v-for="item in todoItems" :key="item.id" :item="item" :group-id="groupId" :data-id="item.id"
                      :data-group-id="groupId"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoGroupPriorityView, TodoGroupView} from "@/entity/todo/TodoGroup";
import CardTodoItem from "@/pages/todo/common/CardTodoItem.vue";
import {openAddTodoItem} from "@/pages/todo/common/AddTodoItem";

const props = defineProps({
  priorityView: {
    type: Object as PropType<TodoGroupPriorityView>,
  },
  group: {
    type: Object as PropType<TodoGroupView>,
  },
  groupId: {
    type: String,
    default: ''
  }
});
const visible = ref(true);

const toggleVisible = useToggle(visible);
const label = computed(() => props.priorityView?.label || '');
const todoItems = computed(() => props.priorityView?.children || []);

</script>
<style scoped lang="less">
.todo-item-priority {
  transition: height 0.3s;

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
}
</style>
