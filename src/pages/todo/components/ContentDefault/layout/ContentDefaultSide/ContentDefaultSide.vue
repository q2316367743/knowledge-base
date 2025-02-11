<template>
  <div class="list">
    <content-default-header/>
    <div class="list-container" @click="setItemId(0)" ref="el">
      <content-default-group v-for="group in groups" :key="group.id" :group="group"/>
      <content-default-complete :groups="groups" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import ContentDefaultHeader
  from "@/pages/todo/components/ContentDefault/layout/ContentDefaultSide/ContentDefaultHeader.vue"
import ContentDefaultGroup
  from "@/pages/todo/components/ContentDefault/layout/ContentDefaultSide/ContentDefaultGroup.vue";
import {moveArrayElement, useSortable} from "@vueuse/integrations/useSortable";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";
import ContentDefaultComplete
  from "@/pages/todo/components/ContentDefault/layout/ContentDefaultSide/ContentDefaultComplete.vue";

const groups = computed(() => useTodoWrapStore().todoGroupView);
const setItemId = (e: number) => useTodoWrapStore().setItemId(e);

const el = ref();

useSortable(el, groups.value, {
  animation: 150,
  handle: '.content-default-group__header',
  group: 'default-todo-side',
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
<style scoped lang="less">

</style>
