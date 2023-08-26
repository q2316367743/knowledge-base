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
            <a-tooltip :content="isMark ? '禁用标记' : '启用标记'">
                <a-switch type="line" v-model="isMark" style="margin-right: 7px">
                    <template checked>启用</template>
                </a-switch>
            </a-tooltip>
            <a-button @click="emit('to-editor')">
                <template #icon>
                    <icon-edit/>
                </template>
            </a-button>
            <a-dropdown position="br">
                <a-button>
                    <template #icon>
                        <icon-download/>
                    </template>
                </a-button>
                <template #content>
                    <a-doption @click="emit('download', 'md')">导出为 Markdown 文件</a-doption>
                    <a-doption @click="emit('download', 'html')">导出为 HTML 文件</a-doption>
                    <a-doption @click="emit('download', 'pdf')">导出为 PDF 文件</a-doption>
                    <a-doption @click="emit('download', 'image')">导出为 图片</a-doption>
                </template>
            </a-dropdown>
            <a-dropdown trigger="click" position="br">
                <a-button type="text">
                    <template #icon>
                        <icon-more/>
                    </template>
                </a-button>
                <template #content>
                    <a-doption @click="settingVisible = true">
                        <template #icon>
                            <icon-settings/>
                        </template>
                        设置
                    </a-doption>
                    <a-doption @click="fullscreen.toggle()">
                        <template #icon>
                            <icon-fullscreen-exit v-if="fullscreen.isFullscreen.value"/>
                            <icon-fullscreen v-else/>
                        </template>
                        全屏
                    </a-doption>
                    <a-doption @click="switchDark()">
                        <template #icon>
                            <icon-sun v-if="isDark"/>
                            <icon-moon v-else/>
                        </template>
                        模式
                    </a-doption>
                </template>
            </a-dropdown>
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
import {useRoute, useRouter} from "vue-router";
import MoreSettingBase from "@/pages/more/setting/base/index.vue";
import {computed, ref, watch} from "vue";
import {useGlobalStore} from "@/store/GlobalStore";

const props = defineProps({
    name: String,
    collapsed: Boolean
});
const emit = defineEmits(['switch-collapsed', 'download', 'to-editor', 'set-mark']);

const route = useRoute();
const router = useRouter();
const fullscreen = useFullscreen();

const settingVisible = ref(false);
const isMark = ref(false);
const isDark = computed(() => useGlobalStore().isDark);
const switchDark = () => useGlobalStore().switchDarkColors();

watch(() => isMark.value, value => emit('set-mark', value));


function toHome() {
    if (route.query.redirect) {
        router.push(route.query.redirect as string)
    } else {
        router.push("/home")
    }
}
</script>
<style scoped>

</style>
