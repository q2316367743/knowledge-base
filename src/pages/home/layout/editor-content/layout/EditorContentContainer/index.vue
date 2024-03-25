<template>
    <a-layout class="ec-container">
        <a-layout-content>
            <editor-content-editor :article-index="articleIndex"/>
        </a-layout-content>
        <a-layout-sider :collapsed="collapsed" :collapsed-width="0" :width="width">
            <editor-content-ai :article-index="articleIndex" ref="aiRef"/>
        </a-layout-sider>
    </a-layout>
</template>
<script lang="ts" setup>
import {computed, onMounted, onUnmounted, PropType, ref} from "vue";
import {useWindowSize} from "@vueuse/core";
import {ArticleIndex} from "@/entity/article";
import {useChatSettingStore} from "@/store/setting/ChatSettingStore";
import {useArticleAiEvent, useUpdateRobotEvent} from "@/store/components/HomeEditorStore";
import EditorContentEditor
    from "@/pages/home/layout/editor-content/layout/EditorContentContainer/EditorContentEditor.vue";
import EditorContentAi from "@/pages/home/layout/editor-content/layout/EditorContentContainer/EditorContentAi/index.vue";

const props = defineProps({
    articleIndex: Object as PropType<ArticleIndex>
});

const size = useWindowSize();

const robot = ref(false);
const aiRef = ref()

const collapsed = computed(() => {
    if (!useChatSettingStore().enable) {
        return true;
    }
    return !robot.value;
});
const width = computed(() => Math.max(Math.min(Math.floor(size.width.value / 8 * 3), 400), 200));

function updateRobot(id: number) {
    if (props.articleIndex && props.articleIndex.id === id) {
        robot.value = !robot.value;
    }
}

function onArticleAi(data: {id: number, content: string}) {
    if (props.articleIndex && props.articleIndex.id === data.id) {
        if (aiRef.value) {
            robot.value = true;
            aiRef.value.sendToMessage(data.content);
        }
    }
}

onMounted(() => {
    useUpdateRobotEvent.off(updateRobot);
    useUpdateRobotEvent.on(updateRobot);
    useArticleAiEvent.off(onArticleAi);
    useArticleAiEvent.on(onArticleAi);
});

onUnmounted(() => {
    useUpdateRobotEvent.off(updateRobot);
    useArticleAiEvent.off(onArticleAi);
})


</script>
<style scoped>

</style>
