<template>
  <div class="todo-item-complete" v-if="completes.length > 0">
    <div class="todo-item-complete__header" @click="toggleVisible()">
      <div class="todo-item-complete__header-left">
        <div class="todo-item-complete__header-handle">
          <icon-down :style="{transform: visible ? '' : 'rotate(-90deg)'}"/>
        </div>
        <div class="todo-item-complete__header-title">已完成 & 已放弃</div>
        <div class="todo-item-complete__header-count">{{ completes.length }}</div>
      </div>
      <div class="todo-item-complete__header-plus">
        <a-button type="text" size="mini" @click.stop>
          <template #icon>
            <icon-plus/>
          </template>
        </a-button>
      </div>
    </div>
    <div class="todo-content-priority__content" v-if="visible">
      <card-todo-item v-for="item in completes" :key="item.id" :item="item" :data-id="item.id" attr/>
      <!-- TODO: 此处需要有个最小长度 -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import CardTodoItem from "@/pages/todo/components/common/CardTodoItem.vue";

defineProps({
  completes: {
    type: Object as PropType<Array<TodoItemIndex>>,
    default: []
  }
});

const visible = ref(true);

const toggleVisible = useToggle(visible);
</script>
<style scoped lang="less">
.todo-item-complete {
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

    .todo-item-complete__header-left {
      display: flex;
      height: 24px;
      align-items: center;


      .todo-item-complete__header-handle {
        color: var(--color-text-2);

        :deep(.arco-icon) {
          transition: 0.3s;
        }
      }

      .todo-item-complete__header-title {
        margin: 0 8px;
        font-size: 0.9rem;
        font-weight: bold;
      }

      .todo-item-complete__header-count {
        color: var(--color-text-2);
      }
    }

    .todo-item-complete__header-plus {
      opacity: 0;
    }

    &:hover {
      .todo-item-complete__header-plus {
        opacity: 1;
      }
    }

  }

}
</style>
