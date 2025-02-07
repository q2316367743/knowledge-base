<template>
  <div class="content-card-priority" v-if="group">
    <header class="content-card-priority__header">
      <div class="title">
        {{ group.name }}
        <a-tag class="length">{{ group.items.length }}</a-tag>
      </div>
      <div class="extra">
        <a-button type="text" @click="openAddTodoItem(group)">
          <template #icon>
            <icon-plus/>
          </template>
        </a-button>
        <a-dropdown>
          <a-button type="text">
            <template #icon>
              <icon-more/>
            </template>
          </a-button>
          <template #content>
            <a-doption @click="openEditTodoGroupFunc(group.id, group.name, group.children)">
              <template #icon>
                <icon-edit/>
              </template>
              重命名
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-rotate-left/>
              </template>
              在左侧添加分组
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-rotate-right/>
              </template>
              在右侧添加分组
            </a-doption>
            <a-doption>
              <template #icon>
                <icon-translate/>
              </template>
              移动到
            </a-doption>
            <a-doption @click="openDeleteTodoGroupFunc(group.id, group.name)">
              <template #icon>
                <icon-delete/>
              </template>
              删除
            </a-doption>
          </template>
        </a-dropdown>
      </div>
    </header>
    <div class="content-card-priority__content">
      <todo-item-priority v-for="priority in group.children" :key="priority.value" :priority-view="priority"/>
    </div>
    <todo-item-complete :completes="group.complete"/>
  </div>
</template>
<script lang="ts" setup>
import {TodoGroupView} from "@/entity/todo/TodoGroup";
import {openAddTodoItem} from "@/pages/todo/components/common/AddTodoItem";
import {openDeleteTodoGroupFunc, openEditTodoGroupFunc} from "@/pages/todo/components/func/TodoGroupFunc";
import TodoItemPriority from "@/pages/todo/components/common/TodoItemPriority.vue";
import TodoItemComplete from "@/pages/todo/components/common/TodoItemComplete.vue";

defineProps({
  group: {
    type: Object as PropType<TodoGroupView>
  }
});
</script>
<style scoped lang="less">
.content-card-priority {
  width: 260px;
  height: calc(100% - 28px);
  margin: 7px 8px 14px;
  border-radius: 2px;
  position: relative;

  .content-card-priority__header {
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

  .content-card-priority__content {
    margin-top: 8px;
    // TODO: 此处要滚动
  }
}
</style>
