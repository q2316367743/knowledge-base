<template>
    <div class="more-update-log">
        <a-timeline style="margin-top: 10px;" label-position="relative">
            <a-timeline-item :label="log.time" placement="top" v-for="log in UpdateLog">
                <a-card shadow="hover" :title="log.version">
                    <div class="entry">
                        <update-item :log="log"/>
                    </div>
                </a-card>
            </a-timeline-item>
        </a-timeline>
    </div>
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
}
</style>
