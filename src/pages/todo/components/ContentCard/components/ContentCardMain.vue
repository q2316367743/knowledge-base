<template>
  <main class="content-card-main" ref="content-card-main">
    <!-- 现在已有的待办分组：-->
    <content-card-priority v-for="group in groups" :key="group.id" :group="group"/>
    <!-- 添加待办分组按钮：-->
  </main>
</template>
<script lang="ts" setup>
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import ContentCardPriority from "@/pages/todo/components/ContentCard/components/ContentCardPriority.vue";
import {useSortable, moveArrayElement} from "@vueuse/integrations/useSortable";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";

const el = useTemplateRef<HTMLDivElement>('content-card-main');
const groups = computed(() => useTodoWrapStore().todoGroupView);

useSortable(el, groups, {
  animation: 150,
  handle: '.content-card-priority__header',
  group: 'card-todo',
  onUpdate: (e) => {
    // do something
    const {oldIndex = 0, newIndex = 0} = e;
    moveArrayElement(groups.value, oldIndex, newIndex);
    // nextTick required here as moveArrayElement is executed in a microtask
    // so we need to wait until the next tick until that is finished.
    nextTick(() => {
      /* do something */
      useTodoGroupStore().sort(groups.value.map(e => e.id));
    })
  }
})
</script>
<style scoped>
.content-card-main {
  position: absolute;
  top: 32px;
  left: 0;
  right: 0;
  bottom: 0;

  display: grid;
  grid-auto-flow: column; /* 横向排列 */
  grid-auto-columns: 260px; /* 每个子项宽度 */
  gap: 16px; /* 可选间隙 */
  overflow-x: auto; /* 横向滚动 */
  overflow-y: hidden; /* 隐藏垂直滚动 */
}
</style>
