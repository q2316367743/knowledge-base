<template>
  <main class="content-card-main" ref="content-card-main">
    <!-- 现在已有的待办分组：-->
    <content-card-group v-for="group in groups" :key="group.id" :group="group"/>
    <!-- 添加待办分组按钮：-->
    <content-card-empty v-if="showEmpty"/>
    <!-- 关联的笔记：-->
    <content-card-article v-if="!hideOfArticle"/>
  </main>
</template>
<script lang="ts" setup>
import {useSortable, moveArrayElement} from "@vueuse/integrations/useSortable";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {TodoCategoryGroupEnum} from "@/entity/todo/TodoCategory";
import ContentCardArticle from "@/pages/todo/ContentCard/components/ContentCardArticle.vue";
import ContentCardGroup from "@/pages/todo/ContentCard/ContentCardDefault/ContentCardGroup.vue";
import ContentCardEmpty from "@/pages/todo/ContentCard/ContentCardDefault/ContentCardEmpty.vue";

const el = useTemplateRef<HTMLDivElement>('content-card-main');
const groups = computed(() => useTodoWrapStore().todoGroupView);
const showAddGroupBtn = computed(() => useTodoWrapStore().showAddGroupBtn);
const hideOfArticle = computed(() => useTodoWrapStore().hideOfArticle);
const groupType = computed(() => useTodoWrapStore().groupType);

const showEmpty = computed(()  => {
  return (groups.value.length === 0 || showAddGroupBtn.value) && groupType.value === TodoCategoryGroupEnum.DEFAULT
})

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
});
</script>
<style scoped>
.content-card-main {
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
  margin-right: 8px;

  display: grid;
  grid-auto-flow: column; /* 横向排列 */
  grid-auto-columns: 268px; /* 每个子项宽度 */
  gap: 8px; /* 可选间隙 */
  overflow-x: auto; /* 横向滚动 */
  overflow-y: hidden; /* 隐藏垂直滚动 */
}
</style>
