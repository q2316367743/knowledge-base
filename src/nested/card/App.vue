<template>
    <div class="app kb-card">
        <div style="text-align: center;">
            <a-space size="large">
                <a-statistic :value="12" title="文章数量"/>
                <a-statistic :value="12" title="待办数量"/>
            </a-space>
        </div>
        <div style="text-align: center;margin-top: 14px;">
            <a-button-group type="primary">
                <a-space size="large">
                    <a-button>新建待办</a-button>
                </a-space>
            </a-button-group>
        </div>
        <div class="setting">
            <a-button type="text">
                <template #icon>
                    <icon-settings />
                </template>
            </a-button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {useGlobalStore} from "@/store/GlobalStore";


useGlobalStore().initDarkColors();

</script>
<style scoped lang="less">
.kb-card {
    padding: 14px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .setting {
        position: absolute;
        top: 7px;
        right: 7px;
    }
}
</style>
