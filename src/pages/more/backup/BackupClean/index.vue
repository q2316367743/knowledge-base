<template>
  <div class="p-8px">
    <t-alert title="数据清理">删除一些无用存储</t-alert>
    <t-space style="margin: 14px 0;">
      <t-button @click="removeTodoCode()">
        删除待办关键字
      </t-button>
    </t-space>
  </div>
</template>
<script lang="ts" setup>
import {removeTodoCode} from "@/pages/more/backup/BackupClean/func/FeatureFunc";
</script>
<style scoped>

</style>
