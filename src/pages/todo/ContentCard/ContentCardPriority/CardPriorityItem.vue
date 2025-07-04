<template>
  <div class="card-priority-item" v-if="priority">
    <header class="card-priority-item__header">
      <div class="title">
        {{ priority.label }}
        <t-tag class="length">{{ count }}</t-tag>
      </div>
      <div class="extra">
        <t-button variant="text" theme="primary" shape="square" @click="openAddTodoItem({priority: priority.value})">
          <template #icon>
            <plus-icon/>
          </template>
        </t-button>
      </div>
    </header>
    <div class="card-priority-item__content">
      <card-todo-item v-for="item in items" :key="item.id" :item="item" :data-id="item.id"/>
      <content-card-complete :completes="priority.complete" v-if="!hideOfCompleteOrAbandon"/>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {TodoPriorityView} from "@/entity/todo/TodoGroup";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {openAddTodoItem} from "@/pages/todo/common/AddTodoItem";
import CardTodoItem from "@/pages/todo/ContentCard/components/CardTodoItem.vue";
import ContentCardComplete from "@/pages/todo/ContentCard/components/ContentCardComplete.vue";
import {PlusIcon} from "tdesign-icons-vue-next";

const props = defineProps({
  priority: {
    type: Object as PropType<TodoPriorityView>
  },
});

const count = computed(() => props.priority?.children.length);
const items = computed(() => props.priority?.children);
const hideOfCompleteOrAbandon = computed(() => useTodoWrapStore().hideOfCompleteOrAbandon);
</script>
<style scoped lang="less">
.card-priority-item {
  width: 256px;
  height: calc(100vh - 40px);
  margin: 7px 8px;
  border-radius: var(--border-radius-medium);
  position: relative;
  border: 2px solid transparent;
  padding: 0 4px;

  &.drag {
    border-color: rgb(var(--arcoblue-4));
  }

  .card-priority-item__header {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .title {
      padding: 8px 8px;
      font-weight: bold;

      .length {
        font-weight: normal;
        font-size: 0.8rem;
        margin-left: 4px;
      }
    }
  }

  .card-priority-item__content {
    margin-top: 8px;
    height: calc(100% - 54px);
    overflow: auto;
  }
}
</style>
