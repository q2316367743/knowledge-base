<template>
    <div class="backup">
        <backup-webdav />
        <backup-file />
        <backup-export />
        <backup-clean />
    </div>
</template>
<script lang="ts" setup>
import BackupWebdav from "@/pages/more/backup/backup-webdav.vue";
import BackupFile from "@/pages/more/backup/backup-file.vue";
import BackupExport from "@/pages/more/backup/BackupExport/index.vue";
import BackupClean from "@/pages/more/backup/BackupClean/index.vue";
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
