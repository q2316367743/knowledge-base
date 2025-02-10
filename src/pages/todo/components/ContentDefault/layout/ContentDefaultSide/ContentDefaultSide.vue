<template>
  <div class="list">
    <content-default-header/>
    <div class="list-container" @click="setItemId(0)">
      <content-default-group v-for="group in groups" :key="group.id" :group="group"/>
      <!-- TODO: 关联的文章 -->
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import ContentDefaultHeader from "@/pages/todo/components/ContentDefault/layout/ContentDefaultSide/ContentDefaultHeader.vue"
import ContentDefaultGroup
  from "@/pages/todo/components/ContentDefault/layout/ContentDefaultSide/ContentDefaultGroup.vue";

const groups = computed(() => useTodoWrapStore().todoGroupView);
const setItemId = (e: number) => useTodoWrapStore().setItemId(e);
</script>
<style scoped lang="less">

</style>
