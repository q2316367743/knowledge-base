<template>
  <t-form-item label="问题" label-align="top">
    <t-input v-model="data.question" placeholder="请输入问题" clearable/>
  </t-form-item>
  <t-form-item label="答案" label-align="top" help="请输入答案">
    <memo-md-editor v-model="data.answer"/>
  </t-form-item>
  <t-form-item label="解析" label-align="top" help="请输入解析">
    <memo-md-editor v-model="data.analysis"/>
  </t-form-item>
</template>
<script lang="ts" setup>
import {MemoDataCardText} from "@/editor/MemoEditor/types";
import MemoMdEditor from "@/editor/MemoEditor/components/MemoMdEditor.vue";

const data = defineModel<Partial<MemoDataCardText>>({
  default: () => ({})
})
</script>
<style scoped lang="less">
</style>
