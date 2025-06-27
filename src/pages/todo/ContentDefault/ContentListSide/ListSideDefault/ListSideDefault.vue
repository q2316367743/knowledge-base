<template>
  <div class="list-side-default" ref="el">
    <list-side-top :items="top"/>
    <template v-if="groups.length > 0">
      <list-side-one v-if="groups.length === 1 && groups[0].id === '-1'" :group="groups[0]"/>
      <template v-else>
        <list-side-group v-for="group in groups" :key="group.id" :group="group"/>
      </template>
    </template>
    <list-side-complete :groups="groups" v-if="!hideOfCompleteOrAbandon"/>
  </div>
</template>
<script lang="ts" setup>
import {moveArrayElement, useSortable} from "@vueuse/integrations/useSortable";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {useTodoGroupStore} from "@/store/db/TodoGroupStore";
import ListSideGroup
  from "@/pages/todo/ContentDefault/ContentListSide/ListSideDefault/ListSideGroup.vue";
import ListSideComplete
  from "@/pages/todo/ContentDefault/ContentListSide/ListSideDefault/ListSideComplete.vue";
import ListSideOne from "@/pages/todo/ContentDefault/ContentListSide/ListSideDefault/ListSideOne.vue";
import ListSideTop from "@/pages/todo/ContentDefault/components/ListSideTop.vue";

const groups = computed(() => useTodoWrapStore().todoGroupView);
const top = computed(() => groups.value.flatMap(e => e.top));
const hideOfCompleteOrAbandon = computed(() => useTodoWrapStore().hideOfCompleteOrAbandon);

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
.list-side-default {
  position: absolute;
  top: 40px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: auto;
}
</style>
