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
      <tag-group v-model="item.attr.tags" @change="updateContent()"/>
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
  // 更新标题
  useTodoItemStore().updateById(
    useTodoWrapStore().itemId,
    {title: item.value.index.title}
  )
}

function updatePriority() {
  //  更新优先级
  useTodoItemStore().updateById(
    useTodoWrapStore().itemId,
    {priority: item.value.index.priority}
  )
}


function updateContent() {
  // 更新内容
  useTodoItemStore().saveContent(
    useTodoWrapStore().itemId,
    item.value.content.record,item.value.content.rev)
}

</script>
<style scoped>

</style>
