<template>
    <div class="mind-map-editor-wrap">
        <div class="mind-map-editor" ref="mindMapEditor"></div>
        <mind-map-count v-if="available" :mind-map="mindMap"/>
        <mind-map-tool v-if="available && !props.readOnly" :mind-map="mindMap" :width="size.width.value"/>
        <mind-map-setting v-if="available && !props.readOnly" :mind-map="mindMap"/>
        <mind-map-context v-if="available && !props.readOnly" :mind-map="mindMap"/>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, onBeforeUnmount, ref, shallowRef, watch} from "vue";
import MindMap from "simple-mind-map";
import {useElementSize} from "@vueuse/core";

// 组件
import MindMapCount from "@/pages/home/layout/editor-content/editor/MindMapEditor/components/MindMapCount.vue";
import MindMapTool from "@/pages/home/layout/editor-content/editor/MindMapEditor/components/MindMapTool/index.vue";
import MindMapSetting
    from "@/pages/home/layout/editor-content/editor/MindMapEditor/components/MindMapSetting/index.vue";
import {openArticleImport} from "@/pages/home/layout/editor-content/components/ArticleImport";
import {useArticleExportEvent, useArticleImportEvent} from "@/store/components/HomeEditorStore";
import {openMindMapExport} from "@/pages/home/layout/editor-content/editor/MindMapEditor/components/MindMapExport";
import MindMapContext from "@/pages/home/layout/editor-content/editor/MindMapEditor/components/MindMapContext.vue";

// 插件
import MiniMap from 'simple-mind-map/src/plugins/MiniMap.js';
import Export from 'simple-mind-map/src/plugins/Export.js';
import ExportPDF from 'simple-mind-map/src/plugins/ExportPDF.js'
import ExportXMind from 'simple-mind-map/src/plugins/ExportXMind.js'
import xmind from 'simple-mind-map/src/parse/xmind.js'
import markdown from 'simple-mind-map/src/parse/markdown.js'
import AssociativeLine from 'simple-mind-map/src/plugins/AssociativeLine.js'
import Select from 'simple-mind-map/src/plugins/Select.js'
import Drag from 'simple-mind-map/src/plugins/Drag.js'

const props = defineProps({
    modelValue: {
        type: Object,
        default: {},
        required: false
    },
    readOnly: Boolean,
    articleId: Number
});
const emits = defineEmits(['update:modelValue']);

const mindMapEditor = ref<HTMLElement>();
const size = useElementSize(mindMapEditor);

const mindMap = shallowRef<MindMap>();

const available = computed(() => !!mindMap.value);

onMounted(() => {
    if (!mindMapEditor.value) {
        return;
    }
    mindMap.value = new MindMap({
        // @ts-ignore
        el: mindMapEditor.value
    });
    mindMap.value.setFullData(props.modelValue);
    mindMap.value.setMode(props.readOnly ? 'readonly' : 'edit');
    mindMap.value.reRender(() => console.log("reRender"));

    mindMap.value.on('data_change', () => {
        // data数据是不带节点对象的纯数据
        // 如果你需要操作节点对象，可以使用mindMap.renderer.renderTree
        if (mindMap.value) {
            emits("update:modelValue", mindMap.value.getData(true));
        }
    });

    mindMap.value.addPlugin(MiniMap, undefined);
    mindMap.value.addPlugin(Export, undefined);
    mindMap.value.addPlugin(ExportPDF, undefined);
    mindMap.value.addPlugin(ExportXMind, undefined);
    mindMap.value.addPlugin(AssociativeLine, undefined);
    mindMap.value.addPlugin(Select, undefined);
    mindMap.value.addPlugin(Drag, undefined);

    useArticleExportEvent.off(onExport);
    useArticleExportEvent.on(onExport);
    useArticleImportEvent.off(onImport);
    useArticleImportEvent.on(onImport);

});

watch(() => size.width.value, () => mindMap.value && mindMap.value.resize());
watch(() => size.height.value, () => mindMap.value && mindMap.value.resize());
watch(() => props.readOnly, value => mindMap.value && mindMap.value.setMode(value ? 'readonly' : 'edit'))

onBeforeUnmount(() => {
    useArticleExportEvent.off(onExport);
    useArticleImportEvent.off(onImport);
    if (mindMap.value) {
        mindMap.value.destroy();
    }
});

function onExport(id: number) {
    if (props.articleId === id && mindMap.value) {
        openMindMapExport(mindMap.value, id);
    }
}

function onImport(id: number) {
    if (props.articleId === id && mindMap.value) {
        openArticleImport(['.xmind', '.md', '.markdown']).then(file => {
            if (file.name.endsWith('.xmind')) {
                xmind.parseXmindFile(file).then((data: any) => {
                    if (mindMap.value) {
                        mindMap.value.setData(data);
                    }
                });
            } else if (file.name.endsWith('.md') || file.name.endsWith('.markdown')) {
                const fileReader = new FileReader()
                fileReader.readAsText(file)
                fileReader.onload = async evt => {
                    if (evt.target) {
                        const data = await markdown.transformMarkdownTo(evt.target.result);
                        if (mindMap.value) {
                            mindMap.value.setData(data);
                        }
                    }
                }
            }
        })
    }
}


</script>
<style lang="less">
.mind-map-editor-wrap {
    position: relative;
    width: 100%;
    height: 100%;

    .mind-map-editor {
        width: 100%;
        height: 100%;
        background-color: transparent !important;
    }
}
</style>
