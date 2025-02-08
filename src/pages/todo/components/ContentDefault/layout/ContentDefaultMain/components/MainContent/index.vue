<template>
  <div class="content">
    <main class="container kb-wang-editor">
      <rich-text-editor v-model="item.content" v-if="isInit"/>
      <a-result v-else title="正在加载中">
        <template #icon>
          <icon-loading :size="32"/>
        </template>
      </a-result>
    </main>
    <footer class="footer">
      <tag-group v-model="item.tags"/>
      <main-content-attr/>
    </footer>
  </div>
</template>
<script lang="ts" setup>
import {getDefaultTodoItemContent, TodoItemContent} from "@/entity/todo/TodoItem";
import MessageUtil from "@/utils/modal/MessageUtil";
import MainContentAttr
  from "@/pages/todo/components/ContentDefault/layout/ContentDefaultMain/components/MainContent/MainContentAttr.vue";
import RichTextEditor from "@/editor/RichTextEditor/index.vue";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";

let lock = false;
let todo = false;

const item = ref<TodoItemContent>(getDefaultTodoItemContent());
const isInit = ref(false);
let rev: undefined | string = undefined

async function init() {
  // 获取内容
  const res = await useTodoItemStore().getTodoItemContent(useTodoWrapStore().itemId);
  item.value = res.record;
  rev = res.rev;
  isInit.value = true;
  // 重新设置编辑器的值
  watch(() => item.value.content, () => autoSave());
}

// 内容的自动保存
const autoSave = () => {
  if (lock) {
    todo = true;
    return;
  }
  lock = true;
  useTodoItemStore().saveContent(useTodoWrapStore().itemId, item.value, rev)
    .then(res => {
      rev = res;
      lock = false;
      if (todo) {
        todo = false;
        autoSave()
      }
    })
    .catch(e => {
      MessageUtil.error("自动保存内容失败", e);
      lock = false;
    });
};


onMounted(() => init());

</script>
<style lang="less">

</style>
