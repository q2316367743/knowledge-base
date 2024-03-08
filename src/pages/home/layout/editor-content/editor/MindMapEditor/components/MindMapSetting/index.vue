<template>
    <div class="mind-map-setting">
        <a-tooltip content="主题">
            <a-button type="text" size="mini" @click="_openMindMapTheme()">
                <template #icon>
                    <icon-bg-colors/>
                </template>
            </a-button>
        </a-tooltip>
        <a-tooltip content="布局">
            <a-button type="text" size="mini" @click="_openMindMapLayout()">
                <template #icon>
                    <icon-layout/>
                </template>
            </a-button>
        </a-tooltip>
        <a-button type="text" size="mini" @click="miniMap = !miniMap">
            <template #icon>
                <icon-computer/>
            </template>
        </a-button>
        <a-tooltip content="快捷键">
            <a-button type="text" size="mini" @click="openMindMapShortcut()">
                <template #icon>
                    <icon-question-circle/>
                </template>
            </a-button>
        </a-tooltip>
    </div>
    <mind-map-mini-map :mind-map="mindMap" v-if="miniMap"/>
</template>
<script lang="ts" setup>
import {PropType, ref} from "vue";
import MindMap from "simple-mind-map";
import MindMapMiniMap from "./MindMapMiniMap.vue";
import {openMindMapShortcut} from "./MindMapShortcut";
import {
    openMindMapTheme
} from "@/pages/home/layout/editor-content/editor/MindMapEditor/components/MindMapSetting/MindMapTheme";
import {
    openMindMapLayout
} from "@/pages/home/layout/editor-content/editor/MindMapEditor/components/MindMapSetting/MindMapLayout";

const props = defineProps({
    mindMap: Object as PropType<MindMap>
});

const miniMap = ref(false);

function _openMindMapTheme() {
    if (props.mindMap) {
        openMindMapTheme(props.mindMap)
    }
}

function _openMindMapLayout() {
    if (props.mindMap) {
        openMindMapLayout(props.mindMap);
    }
}
</script>
<style scoped>
.mind-map-setting {
    position: absolute;
    right: 10px;
    bottom: 10px;
    color: var(--color-text-1);
    background: var(--color-fill-3);
    border-radius: 2px;
    padding: 3px 6px;
}
</style>
