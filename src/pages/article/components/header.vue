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
            <a-button @click="switchDark()">
                <template #icon>
                    <icon-sun v-if="isDark"/>
                    <icon-moon v-else/>
                </template>
            </a-button>
            <a-dropdown>
                <a-button>
                    <template #icon>
                        <icon-download/>
                    </template>
                </a-button>
                <template #content>
                    <a-doption @click="emit('download', 'image')">图片</a-doption>
                    <a-doption @click="emit('download', 'md')">md</a-doption>
                    <a-doption @click="emit('download', 'html')">网页</a-doption>
                </template>
            </a-dropdown>
            <a-button @click="settingVisible = true">
                <template #icon>
                    <icon-settings/>
                </template>
            </a-button>
            <a-button @click="emit('switch-collapsed')" :status="collapsed ? 'normal' : 'success'">
                <template #icon>
                    <icon-layout/>
                </template>
            </a-button>
        </a-button-group>
        <a-modal v-model:visible="settingVisible" title="基础设置" unmount-on-close class="article-setting"
                 :footer="false" draggable>
            <more-setting-base @save="settingVisible = false"/>
        </a-modal>
    </a-layout-header>
</template>
<script lang="ts" setup>
import {useFullscreen} from "@vueuse/core";
import {useRouter} from "vue-router";
import MoreSettingBase from "@/pages/more/setting/base/index.vue";
import {computed, ref} from "vue";
import {useGlobalStore} from "@/store/GlobalStore";

const props = defineProps({
    name: String,
    collapsed: Boolean
});
const emit = defineEmits(['switch-collapsed', 'download']);

const router = useRouter();
const fullscreen = useFullscreen();

const settingVisible = ref(false);
const isDark = computed(() => useGlobalStore().isDark);
const switchDark = () => useGlobalStore().switchDarkColors();


function toHome() {
    router.push("/home")
}
</script>
<style scoped>

</style>
