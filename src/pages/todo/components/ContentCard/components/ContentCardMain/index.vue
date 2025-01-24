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
        <card-todo-item v-for="item in group.children" :key="item.id" :item="item" :data-id="item.id" attr/>
      </div>
    </div>
  </main>
</template>
<script lang="ts" setup>
import {openAddTodoItem} from "@/pages/todo/components/common/AddTodoItem";
import {useTodoItemStore} from "@/store/components/TodoItemStore";
import CardTodoItem from "@/pages/todo/components/common/CardTodoItem.vue";

const groups = computed(() => useTodoItemStore().todoGroupView);
</script>
<style scoped>

</style>
