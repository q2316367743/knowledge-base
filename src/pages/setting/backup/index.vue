<template>
    <div class="backup">
        <backup-webdav />
        <backup-file />
        <backup-export />
    </div>
</template>
<script lang="ts" setup>

import BackupWebdav from "@/pages/setting/backup/backup-webdav.vue";
import BackupFile from "@/pages/setting/backup/backup-file.vue";
import BackupExport from "@/pages/setting/backup/BackupExport/index.vue";
</script>
<style scoped>
.backup {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 7px;
    overflow: auto;
}
</style>
