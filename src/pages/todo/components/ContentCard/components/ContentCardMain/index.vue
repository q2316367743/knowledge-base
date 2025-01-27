<template>
  <main class="main">
    <div class="card-item" v-for="group in groups" :key="group.id">
      <header class="card-item__header">
        <div class="title">
          {{ group.name }}
          <a-tag class="length">{{ group.children.length }}</a-tag>
        </div>
        <div class="extra">
          <a-button type="text" @click="openAddTodoItem()">
            <template #icon>
              <icon-plus/>
            </template>
          </a-button>
          <a-button type="text">
            <template #icon>
              <icon-more/>
            </template>
          </a-button>
        </div>
      </header>
      <div class="content">
        <todo-item-priority v-for="priority in group.children" :key="priority.value" :priority-view="priority"/>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
import {openAddTodoItem} from "@/pages/todo/components/common/AddTodoItem";
import {useTodoItemStore} from "@/store/components/TodoItemStore";
import TodoItemPriority from "@/pages/todo/components/common/TodoItemPriority.vue";

const groups = computed(() => useTodoItemStore().todoGroupView);
</script>
<style scoped>

</style>
