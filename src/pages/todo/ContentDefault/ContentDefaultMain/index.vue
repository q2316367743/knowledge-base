<template>
  <div class="main">
    <header class="header">
      <!-- 标题 -->
      <div class="title">
        <t-input v-model="item.index.title" :clearable="true" placeholder="待办标题，回车修改"
                 @change="updateSelf()"/>
      </div>
      <!-- 优先级 -->
      <priority-dropdown v-model="item.index.priority" variant="outline" @change="updateSelf()"/>
    </header>
    <div class="content">
      <main class="container kb-wang-editor">
        <rich-text-editor v-model="item.content.record.content" simple @change="updateContent()" v-if="isInit"/>
      </main>
    </div>
    <footer class="footer overflow-y-hidden">
      <tag-group v-model="item.attr.tags" @change="updateSelf()"/>
      <main-content-attr/>
    </footer>
  </div>
</template>
<script lang="ts" setup>
import {getDefaultTodoItem, TodoItem} from "@/entity/todo/TodoItem";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import RichTextEditor from "@/editor/RichTextEditor/index.vue";
import MainContentAttr
  from "@/pages/todo/ContentDefault/ContentDefaultMain/components/MainContentAttr.vue";

const item = ref<TodoItem>(getDefaultTodoItem());
const isInit = ref(false);

onMounted(async () => {
  item.value = await useTodoItemStore().getTodoItem(useTodoWrapStore().itemId);
  isInit.value = true;
});

// 只更新标题
function updateSelf() {
  // 更新标题
  useTodoItemStore().updateById(
    useTodoWrapStore().itemId,
    {
      title: item.value.index.title,
      priority: item.value.index.priority
    },
    {
      tags: item.value.attr.tags
    }
  )
}

async function updateContent() {
  if (!isInit.value) return;
  // 更新内容
  item.value.content.rev = await useTodoItemStore().saveContent(
    useTodoWrapStore().itemId,
    item.value.content.record, item.value.content.rev)
}

</script>
<style scoped>

</style>
