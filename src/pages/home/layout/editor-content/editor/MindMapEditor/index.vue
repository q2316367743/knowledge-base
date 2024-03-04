<template>
    <div class="mind-map-editor-wrap">
        <div class="mind-map-editor" ref="mindMapEditor"></div>
        <mind-map-count v-if="available" :mind-map="mindMap"/>
        <mind-map-tool v-if="available" :mind-map="mindMap" :width="size.width.value"/>
        <mind-map-setting v-if="available" :mind-map="mindMap"/>
    </div>
</template>
<script lang="ts" setup>
import {computed, onMounted, onUnmounted, PropType, ref, shallowRef, watch} from "vue";
import MindMap from "simple-mind-map";
import {IWorkbookData} from "@univerjs/core";
import {useGlobalStore} from "@/store/GlobalStore";
import {useElementSize} from "@vueuse/core";
import MindMapCount from "@/pages/home/layout/editor-content/editor/MindMapEditor/components/MindMapCount.vue";
import MindMapTool from "@/pages/home/layout/editor-content/editor/MindMapEditor/components/MindMapTool/index.vue";
import MindMapSetting
    from "@/pages/home/layout/editor-content/editor/MindMapEditor/components/MindMapSetting/index.vue";

// 插件
import MiniMap from 'simple-mind-map/src/plugins/MiniMap.js'

const props = defineProps({
    modelValue: {
        type: Object as PropType<IWorkbookData>,
        default: {},
        required: false
    },
    readOnly: Boolean
});
const emits = defineEmits(['update:modelValue']);

const mindMapEditor = ref<HTMLElement>();
const size = useElementSize(mindMapEditor);

const mindMap = shallowRef<MindMap | null>(null);

const available = computed(() => !!mindMap.value);

onMounted(() => {
    if (!mindMapEditor.value) {
        return;
    }
    console.log(useGlobalStore().isDark)
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
});

watch(() => size.width.value, () => mindMap.value && mindMap.value.resize());
watch(() => size.height.value, () => mindMap.value && mindMap.value.resize());
watch(() => props.readOnly, value => mindMap.value && mindMap.value.setMode(value ? 'readonly' : 'edit'))

onUnmounted(() => {
    if (mindMap.value) {
        mindMap.value.destroy();
    }
});


</script>
<style lang="less">
.mind-map-editor-wrap {
    position: relative;
    width: 100%;
    height: 100%;

    .mind-map-editor {
        width: 100%;
        height: 100%;
    }
}
</style>
