<template>
  <main class="content-card-main">
    <!-- 现在已有的待办分组：-->
    <content-card-priority v-for="group in groups" :key="group.id" :group="group"/>
    <!-- 添加待办分组按钮：-->
  </main>
</template>
<script lang="ts" setup>
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import ContentCardPriority from "@/pages/todo/components/ContentCard/components/ContentCardPriority.vue";

const groups = computed(() => useTodoWrapStore().todoGroupView);
</script>
<style scoped>
.content-card-main {
  display: flex;
  flex-direction: row;
}
</style>
