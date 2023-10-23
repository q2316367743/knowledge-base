<template>
    <div class="backup">
        <backup-webdav />
        <backup-file />
    </div>
</template>
<script lang="ts" setup>

import BackupWebdav from "@/pages/setting/backup/backup-webdav.vue";
import BackupFile from "@/pages/setting/backup/backup-file.vue";
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
