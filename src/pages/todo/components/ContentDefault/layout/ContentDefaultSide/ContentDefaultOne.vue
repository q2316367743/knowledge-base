<template>
  <div class="content-default-group" v-if="group">
    <content-default-group-list :group-id="group.id" :items="todoItems"/>
  </div>
</template>
<script lang="ts" setup>
import {TodoGroupView} from "@/entity/todo/TodoGroup";
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import ContentDefaultGroupList
  from "@/pages/todo/components/ContentDefault/layout/ContentDefaultSide/ContentDefaultGroupList.vue";

const props = defineProps({
  group: {
    type: Object as PropType<TodoGroupView>
  }
});

const todoItems = computed<Array<TodoItemIndex>>(() => {
  if (!props.group) {
    return [];
  }
  const {group} = props;
  return group.children.flatMap(item => item.children);
})
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
