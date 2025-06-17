<template>
  <splitpanes class="default-theme home-editor" @resize="onResize" :class="{collapsed: noteSplitLeft===0}">
    <pane :size="noteSplitLeft" class="relative">
      <editor-side/>
    </pane>
    <pane :size="noteSplitRight" class="relative">
      <editor-content/>
    </pane>
  </splitpanes>

</template>
<script lang="ts" setup>
import {Splitpanes, Pane} from 'splitpanes'
import {noteSplitWidth, noteSplitLeft, noteSplitRight} from "@/store/components/HomeEditorStore";
import {useCustomerFileNameStore} from "@/store/setting/CustomerFileNameStore";
import EditorSide from '@/pages/note/layout/editor-side/index.vue';
import EditorContent from "@/pages/note/layout/editor-content/index.vue";


const onResize = (data: any) => noteSplitWidth.value = data.prevPane.size;



useCustomerFileNameStore().init();

</script>
<style lang="less">
.home-editor {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  .splitpanes__pane {
    position: relative;
    background-color: transparent !important;
  }

  &.collapsed {
    .splitpanes__splitter {
      display: none;
    }
  }

}
</style>
