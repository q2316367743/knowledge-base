<template>
  <div class="list">
    <content-default-header/>
    <list-side-priority v-if="groupType === TodoCategoryGroupEnum.PRIORITY"/>
    <list-side-default v-else/>
  </div>
</template>
<script lang="ts" setup>
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {TodoCategoryGroupEnum} from "@/entity/todo/TodoCategory";
import ContentDefaultHeader
  from "@/pages/todo/ContentDefault/ContentListSide/ContentDefaultHeader.vue"
import ListSidePriority
  from "@/pages/todo/ContentDefault/ContentListSide/ListSidePriority/ListSidePriority.vue";
import ListSideDefault
  from "@/pages/todo/ContentDefault/ContentListSide/ListSideDefault/ListSideDefault.vue";

const groupType = computed(() => useTodoWrapStore().groupType);
</script>
<style scoped lang="less">
</style>
