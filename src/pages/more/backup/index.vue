<template>
  <t-tabs :default-value="1">
    <t-tab-panel label="WebDAV备份" :value="1">
      <backup-webdav/>
    </t-tab-panel>
    <t-tab-panel label="文件备份设置" :value="2">
      <backup-file/>
    </t-tab-panel>
    <t-tab-panel label="数据导出" :value="3">
      <backup-export/>
    </t-tab-panel>
    <t-tab-panel label="数据清理" :value="4" >
      <backup-clean/>
    </t-tab-panel>
  </t-tabs>
</template>
<script lang="ts" setup>
import BackupWebdav from "@/pages/more/backup/backup-webdav.vue";
import BackupFile from "@/pages/more/backup/backup-file.vue";
import BackupExport from "@/pages/more/backup/BackupExport/index.vue";
import BackupClean from "@/pages/more/backup/BackupClean/index.vue";
</script>
<style scoped>
</style>
