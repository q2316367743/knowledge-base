<template>
  <div class="todo-item-complete" v-if="completes.length > 0">
    <div class="todo-item-complete__header" @click="toggleVisible()">
      <div class="todo-item-complete__header-left">
        <div class="todo-item-complete__header-handle">
          <chevron-down-icon :style="{transform: visible ? '' : 'rotate(-90deg)'}"/>
        </div>
        <div class="todo-item-complete__header-title">已完成 & 已放弃</div>
        <div class="todo-item-complete__header-count">{{ completes.length }}</div>
      </div>
    </div>
    <div class="todo-item-complete__content" v-if="visible">
      <card-todo-item v-for="item in items" :key="item.id" :item="item" :data-id="item.id" attr/>
      <div class="todo-item-complete__content-footer" v-if="items.length > 5">
        <span class="text" @click="toggleAll()">{{ all ? '折叠' : '展开' }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import CardTodoItem from "@/pages/todo/ContentCard/components/CardTodoItem.vue";
import {toSorted} from "@/utils/lang/ArrayUtil";
import {ChevronDownIcon} from "tdesign-icons-vue-next";

const props = defineProps({
  completes: {
    type: Object as PropType<Array<TodoItemIndex>>,
    default: []
  }
});

const visible = ref(true);
const toggleVisible = useToggle(visible);
const all = ref(false);
const toggleAll = useToggle(all);

const source = computed(() => toSorted(props.completes, (a, b) => b.id - a.id));

const items = computed(() => {
  if (all.value) {
    return source.value;
  }
  return source.value.slice(0, 5);
})
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
        color: var(--td-text-color-secondary);

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
        color: var(--td-text-color-secondary);
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

  &__content {
    &-footer {
      text-align: center;
      padding: 8px;

      .text {
        cursor: pointer;
        color: rgb(var(--arcoblue-6));
        transition: color 0.3s;

        &:hover {
          color: rgb(var(--arcoblue-3));
        }
      }
    }
  }

}
</style>
