<template>
    <div class="more-update-log">
        <a-alert>
            <span>反馈建议前往</span>
            <a-link @click="toTxc()">兔小巢</a-link>
            <span>，支持图片反馈。</span>
        </a-alert>
        <a-timeline style="margin-top: 10px;" label-position="relative">
            <a-timeline-item :label="log.time" placement="top" v-for="log in UpdateLog">
                <a-card shadow="hover" :title="log.version">
                    <update-item :log="log"/>
                    <template #extra>
                        <a-link v-if="log.url">详细链接</a-link>
                    </template>
                </a-card>
            </a-timeline-item>
        </a-timeline>
    </div>
    <a-back-top target-container=".more-update-log"/>
</template>
<script lang="ts" setup>
import UpdateItem from "@/components/update-check/item.vue";
import UpdateLog from "@/global/UpdateLog";
import Constant from "@/global/Constant";

const toTxc = () => utools.shellOpenExternal(Constant.feedback);
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
