<template>
    <a-layout-header class="header">
        <a-button-group type="text">
            <a-button @click="switchCollapsed()" v-if="isEmbed">
                <template #icon>
                    <icon-menu/>
                </template>
            </a-button>
            <a-button @click="toHome()" v-else>
                <template #icon>
                    <icon-left/>
                </template>
            </a-button>
        </a-button-group>
        <div class="title">{{ props.name }}</div>
        <a-button-group type="text">
            <a-space>
                <a-button @click="toEditor()">
                    <template #icon>
                        <icon-edit/>
                    </template>
                </a-button>
                <a-dropdown trigger="click" position="br">
                    <a-button type="text">
                        <template #icon>
                            <icon-more/>
                        </template>
                    </a-button>
                    <template #content>
                        <a-doption @click="emit('switch-collapsed')">
                            <template #icon>
                                <icon-layout/>
                            </template>
                            目录
                        </a-doption>
                        <a-doption @click="switchDark()">
                            <template #icon>
                                <icon-sun v-if="isDark"/>
                                <icon-moon v-else/>
                            </template>
                            模式
                        </a-doption>
                        <a-doption @click="fullscreen.toggle()">
                            <template #icon>
                                <icon-fullscreen-exit v-if="fullscreen.isFullscreen.value"/>
                                <icon-fullscreen v-else/>
                            </template>
                            全屏
                        </a-doption>
                        <a-dsubmenu>
                            <template #icon>
                                <icon-download/>
                            </template>
                            下载
                            <template #content>
                                <a-doption @click="emit('download', 'md')">导出为 Markdown 文件</a-doption>
                                <a-doption @click="emit('download', 'html')">导出为 HTML 文件</a-doption>
                                <a-doption @click="emit('download', 'pdf')">导出为 PDF 文件</a-doption>
                                <a-doption @click="emit('download', 'image')">导出为 图片</a-doption>
                            </template>
                        </a-dsubmenu>
                        <a-doption @click="settingVisible = true">
                            <template #icon>
                                <icon-settings/>
                            </template>
                            设置
                        </a-doption>
                    </template>
                </a-dropdown>
            </a-space>
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
import MoreSettingBase from "@/pages/setting/base/index.vue";
import {computed, ref} from "vue";
import {useGlobalStore} from "@/store/GlobalStore";
import {useBaseSettingStore} from "@/store/db/BaseSettingStore";
import HomeTypeEnum from "@/enumeration/HomeTypeEnum";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";

const props = defineProps({
    name: String,
    collapsed: Boolean
});
const emit = defineEmits(['switch-collapsed', 'download', 'to-editor', 'set-mark']);

const route = useRoute();
const router = useRouter();
const fullscreen = useFullscreen();

const settingVisible = ref(false);
const isDark = computed(() => useGlobalStore().isDark);

const isEmbed = computed(() => useBaseSettingStore().baseSetting.homeType === HomeTypeEnum.EDITOR && route.path === '/home');

const switchDark = () => useGlobalStore().switchDarkColors();
const switchCollapsed = () => useHomeEditorStore().switchCollapsed();

function toHome() {
    if (route.query.redirect) {
        router.push(route.query.redirect as string)
    } else {
        router.push("/home")
    }
}

function toEditor() {
    emit('to-editor', isEmbed.value);
}

</script>
<style scoped>

</style>
