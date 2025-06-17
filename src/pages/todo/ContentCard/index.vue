<template>
  <div class="todo-content-card">
    <todo-header/>
    <content-card-priority v-if="groupType === TodoCategoryGroupEnum.PRIORITY" />
    <content-card-default v-else/>
  </div>
</template>
<script lang="ts" setup>
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {TodoCategoryGroupEnum} from "@/entity/todo/TodoCategory";
import TodoHeader from "@/pages/todo/common/TodoHeader/TodoHeader.vue";
import ContentCardDefault from "@/pages/todo/ContentCard/ContentCardDefault/ContentCardDefault.vue";
import ContentCardPriority from "@/pages/todo/ContentCard/ContentCardPriority/ContentCardPriority.vue";

const groupType = computed(() => useTodoWrapStore().groupType);
</script>
<style scoped lang="less">
.todo-content-card {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--kb-bg-color-2);
}
</style>
