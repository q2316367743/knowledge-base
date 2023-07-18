<template>
    <a-layout-header class="header">
        <a-button-group type="text">
            <a-button @click="toHome()">
                <template #icon>
                    <icon-left/>
                </template>
            </a-button>
            <div style="margin-left: 7px">{{ props.name }}</div>
        </a-button-group>
        <a-button-group type="text">
            <a-button @click="fullscreen.toggle()">
                <template #icon>
                    <icon-fullscreen-exit v-if="fullscreen.isFullscreen.value"/>
                    <icon-fullscreen v-else/>
                </template>
            </a-button>
            <a-button @click="settingVisible = true">
                <template #icon>
                    <icon-settings/>
                </template>
            </a-button>
        </a-button-group>
        <a-modal v-model:visible="settingVisible" title="基础设置" unmount-on-close class="article-setting"
                 :footer="false">
            <more-setting-base @save="settingVisible = false"/>
        </a-modal>
    </a-layout-header>
</template>
<script lang="ts" setup>
import {useFullscreen} from "@vueuse/core";
import {useRouter} from "vue-router";
import MoreSettingBase from "@/pages/more/setting/base/index.vue";
import {ref} from "vue";

const props = defineProps({
    name: String
});

const router = useRouter();
const fullscreen = useFullscreen();

const settingVisible = ref(false);


function toHome() {
    router.push("/home")
}
</script>
<style scoped>

</style>
