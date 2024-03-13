<template>
    <div>
        <a-alert title="数据清理">删除一些无用存储</a-alert>
        <a-button-group type="primary" style="margin: 14px 0;">
            <a-space>
                <a-button @click="removeTodoCode()">
                    删除待办关键字
                </a-button>
            </a-space>
        </a-button-group>
    </div>
</template>
<script lang="ts" setup>
import {removeTodoCode} from "@/pages/more/backup/BackupClean/func/FeatureFunc";
</script>
<style scoped>

</style>
