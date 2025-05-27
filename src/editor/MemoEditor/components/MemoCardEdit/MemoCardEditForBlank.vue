<template>
  <t-form-item label="" label-align="top">
    <t-textarea v-model="data.answer" placeholder="请输入填空，练习时会自动隐藏文字" :autosize="{minRows: 3, maxRows: 5}"/>
  </t-form-item>
</template>
<script lang="ts" setup>
import {MemoDataCardBlank} from "@/editor/MemoEditor/types";

const data = defineModel<Partial<MemoDataCardBlank>>({
  default: () => ({})
})
</script>
<style scoped lang="less">

</style>
