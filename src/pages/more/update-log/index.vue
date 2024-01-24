<template>
    <div class="more-update-log">
        <a-timeline style="margin-top: 10px;" label-position="relative">
            <a-timeline-item :label="log.time" placement="top" v-for="log in UpdateLog">
                <a-card shadow="hover" :title="log.version">
                    <update-item :log="log"/>
                </a-card>
            </a-timeline-item>
        </a-timeline>
    </div>
    <a-back-top target-container=".more-update-log" />
</template>
<script lang="ts" setup>
import UpdateItem from "@/components/update-check/item.vue";
import UpdateLog from "@/global/UpdateLog";
</script>
<style scoped>
.more-update-log {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 7px;
    font-size: 16px;
}
</style>
