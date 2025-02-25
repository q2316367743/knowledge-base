<template>
  <div class="content-default-group" v-if="priority" v-show="count > 0">
    <div class="content-default-group__header" @click.stop="toggleVisible()">
      <div class="content-default-group__header-left">
        <div class="content-default-group__header-handle">
          <icon-down :style="{transform: visible ? '' : 'rotate(-90deg)'}"/>
        </div>
        <div class="content-default-group__header-title">{{ priority.label }}</div>
        <div class="content-default-group__header-count">{{ count }}</div>
      </div>
      <div class="extra">
        <a-button type="text" @click.stop="openAddTodoItem(undefined, priority.value)" size="mini">
          <template #icon>
            <icon-plus/>
          </template>
        </a-button>
      </div>
    </div>
    <list-side-priority-content v-if="visible" :items="todoItems"/>
  </div>
</template>
<script lang="ts" setup>
import {TodoGroupPriorityView} from "@/entity/todo/TodoGroup";
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import {openAddTodoItem} from "@/pages/todo/common/AddTodoItem";
import ListSidePriorityContent
  from "@/pages/todo/ContentDefault/ContentListSide/ListSidePriority/ListSidePriorityContent.vue";

const props = defineProps({
  priority: {
    type: Object as PropType<TodoGroupPriorityView>
  }
});
const count = computed(() => props.priority?.children.length || 0);

const todoItems = computed<Array<TodoItemIndex>>(() => {
  return props.priority?.children || [];
})

const visible = ref(true);

const toggleVisible = useToggle(visible);
</script>
<style scoped lang="less">
.content-default-group {
  margin: 7px 8px 14px;
  border-radius: 2px;
  position: relative;

  .content-default-group__header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    user-select: none;

    .content-default-group__header-left {
      display: flex;
      height: 24px;
      align-items: center;
      font-size: 0.8rem;
      cursor: pointer;


      .content-default-group__header-handle {
        color: var(--color-text-2);

        :deep(.arco-icon) {
          transition: 0.3s;
        }
      }

      .content-default-group__header-title {
        margin: 0 8px;
        font-size: 0.9rem;
        font-weight: bold;
      }

      .content-default-group__header-count {
        color: var(--color-text-2);
      }
    }

  }

}
</style>
