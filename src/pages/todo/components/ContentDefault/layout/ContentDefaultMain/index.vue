<template>
  <div class="main">
    <header class="header">
      <!-- 标题 -->
      <div class="title">
        <a-input v-model="item.index.title" allow-clear placeholder="待办标题，回车修改"
                 @change="updateTitle()"/>
      </div>
      <!-- 优先级 -->
      <priority-dropdown v-model="item.index.priority" type="secondary" @change="updatePriority()"/>
    </header>
    <div class="content">
      <main class="container kb-wang-editor">
        <rich-text-editor v-model="item.content.record.content" simple @change="updateContent()"/>
      </main>
    </div>
    <footer class="footer">
      <tag-group v-model="item.attr.tags" @change="updateTags()"/>
      <main-content-attr/>
    </footer>
  </div>
</template>
<script lang="ts" setup>
import {getDefaultTodoItem, TodoItem} from "@/entity/todo/TodoItem";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import MainContentAttr
  from "@/pages/todo/components/ContentDefault/layout/ContentDefaultMain/components/MainContent/MainContentAttr.vue";
import RichTextEditor from "@/editor/RichTextEditor/index.vue";

const item = ref<TodoItem>(getDefaultTodoItem());

onMounted(async () => {
  item.value = await useTodoItemStore().getTodoItem(useTodoWrapStore().itemId);
});

// 只更新标题
function updateTitle() {
  // TODO: 更新标题
}

function updatePriority() {
  // TODO: 更新优先级
}

function updateTags() {
  // TODO: 更新标签
}

function updateContent() {
  // TODO: 更新内容
}

</script>
<style scoped>

</style>
