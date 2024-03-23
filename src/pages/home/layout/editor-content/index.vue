<template>
    <a-layout class="he-editor">
        <a-layout-header>
            <editor-content-header/>
        </a-layout-header>
        <a-layout class="ec-container">
            <a-layout-content>
                <editor-content-container v-for="article in indexes" :key="article.id" :article-index="article"
                                          v-show="article.id === id"/>
                <a-result title="请在左侧选择文章" subtitle="点击加号创建文章" status="404" v-if="indexes.length === 0"
                          style="margin-top: 20vh">
                </a-result>
            </a-layout-content>
            <a-layout-sider :collapsed="collapsed" :collapsed-width="0" :width="width">
                <editor-content-ai />
            </a-layout-sider>
        </a-layout>
    </a-layout>
</template>
<script lang="ts" setup>
import EditorContentHeader from "@/pages/home/layout/editor-content/layout/EditorContentHeader.vue";
import EditorContentContainer from "@/pages/home/layout/editor-content/layout/EditorContentContainer.vue";
import {computed} from "vue";
import {robot, useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useWindowSize} from "@vueuse/core";
import EditorContentAi from "@/pages/home/layout/editor-content/layout/EditorContentAi.vue";
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";

const indexes = computed(() => useHomeEditorStore().indexes);
const id = computed(() => useHomeEditorStore().id);

const size = useWindowSize();

const collapsed = computed(() => {
    if (!useChatSettingStore().enable) {
        return true;
    }
    return robot.value;
})

const width = computed(() => Math.max(Math.min(Math.floor(size.width.value / 8 * 3), 400), 200));

</script>
<style lang="less">
@import "./index.less";
</style>
