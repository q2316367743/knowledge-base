<template>
  <t-form-item label="问题" label-align="top">
    <t-input v-model="data.question" placeholder="请输入问题" clearable/>
  </t-form-item>
  <t-form-item label="答案" label-align="top">
    <t-textarea v-model="data.answer" placeholder="请输入答案" :autosize="{minRows: 3, maxRows: 5}"/>
  </t-form-item>
  <t-form-item label="解析" label-align="top">
    <t-textarea v-model="data.analysis" placeholder="请输入解析" :autosize="{minRows: 3, maxRows: 5}"/>
  </t-form-item>
</template>
<script lang="ts" setup>
import { MemoDataCardText} from "@/editor/MemoEditor/types";

const data = defineModel<Partial<MemoDataCardText>>({
  default: () => ({})
})
</script>
<style scoped lang="less">

</style>
