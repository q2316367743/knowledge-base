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
        <a-button type="text" size="mini" @click.stop>
          <template #icon>
            <icon-plus/>
          </template>
        </a-button>
      </div>
    </div>
    <div class="todo-content-priority__content" v-show="visible" ref="el">
      <card-todo-item v-for="item in todoItems" :key="item.id" :item="item" :data-id="item.id" attr/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoGroupPriorityView} from "@/entity/todo/TodoGroup";
import CardTodoItem from "@/pages/todo/components/common/CardTodoItem.vue";
import {moveArrayElement, useSortable} from "@vueuse/integrations/useSortable";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";

const props = defineProps({
  priorityView: {
    type: Object as PropType<TodoGroupPriorityView>,
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

const el = ref()


useSortable(el, todoItems, {
  animation: 150,
  handle: '.card-todo-item',
  group: `todo-priority`,
  sort: false,
  onUpdate: (e) => {
    // do something
    const {oldIndex = 0, newIndex = 0} = e;
    moveArrayElement(todoItems.value, oldIndex, newIndex);
    // nextTick required here as moveArrayElement is executed in a microtask
    // so we need to wait until the next tick until that is finished.
  },
  onAdd: (e) => {
    const {item} = e;
    // useTodoGroupStore().pushTo(props.groupId, e.item.dataset.id)
    let dataIdAttr = item.attributes.getNamedItem("data-id");
    if (dataIdAttr) {
      useTodoGroupStore().pushTo(props.groupId, Number(dataIdAttr.value))
    }
  },
  onRemove: (e) => {
    const {item} = e;
    let dataIdAttr = item.attributes.getNamedItem("data-id");
    if (dataIdAttr) {
      useTodoGroupStore().popFrom(props.groupId, Number(dataIdAttr.value))
    }
  }
});
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
