<template>
  <t-form-item label="" label-align="top" help="请输入内容">
    <memo-md-editor v-model="data.answer" />
  </t-form-item>
</template>
<script lang="ts" setup>
import {MemoDataCardBlank} from "@/editor/MemoEditor/types";
import MemoMdEditor from "@/editor/MemoEditor/components/MemoMdEditor.vue";

const data = defineModel<Partial<MemoDataCardBlank>>({
  default: () => ({})
})
</script>
<style scoped lang="less">

</style>
