<template>
  <div class="encrypt-text-display  h-full">
    <pre>{{ data?.text }}</pre>
  </div>
</template>
<script lang="ts" setup>
import {EncryptTextData} from "@/editor/SuperEditor/tools/EncryptTextTool/types";

defineProps({
  data: {
    type: Object as PropType<EncryptTextData>
  }
});
</script>
<style scoped lang="less">
.encrypt-text-display {
  background-color: var(--td-bg-color-container);
  overflow: auto;
  padding: 16px;
  pre {
    padding: 0;
    margin: 0;
  }
}
</style>
