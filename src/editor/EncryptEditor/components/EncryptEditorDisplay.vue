<template>
  <div class="encrypt-editor-display  h-full">
    <pre>{{ data?.text }}</pre>
  </div>
</template>
<script lang="ts" setup>
</script>
<script lang="ts">
import {EncryptTextData} from "@/editor/SuperEditor/tools/EncryptTextTool/types";

export default defineComponent({
  name: 'EncryptEditorDisplay',
  props: {
    data: {
      type: Object as PropType<EncryptTextData>
    }
  }
})
</script>
<style scoped lang="less">
.encrypt-editor-display {
  background-color: var(--td-bg-color-container);
  overflow: auto;
  padding: 16px;
  pre {
    padding: 0;
    margin: 0;
  }
}
</style>
