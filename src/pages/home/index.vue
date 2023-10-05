<template>
    <div class="home">
        <home-preview v-if="homeType === HomeTypeEnum.DEFAULT"/>
        <home-editor v-else-if="homeType === HomeTypeEnum.EDITOR"/>
        <a-result status="404" title="未知的首页类型" subtitle="请前往基础设置中修改" v-else/>
    </div>
</template>
<script lang="ts" setup>
import {computed} from "vue";
import HomePreview from './home-preview/index.vue';
import HomeEditor from './home-editor/index.vue';
import HomeTypeEnum from '@/enumeration/HomeTypeEnum';
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";

const homeType = computed(() => useBaseSettingStore().homeType);

</script>
<style scoped>
.home {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

}
</style>
