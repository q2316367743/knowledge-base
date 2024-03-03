<template>
    <div class="mind-map-editor" ref="mindMapEditor"></div>
</template>
<script lang="ts" setup>
import {onMounted, onUnmounted, PropType, ref, watch} from "vue";
import MindMap from "simple-mind-map";
import {IWorkbookData} from "@univerjs/core";
import {useGlobalStore} from "@/store/GlobalStore";
import {useSaveContentEvent} from "@/store/components/HomeEditorStore";
import {useElementSize, useIntervalFn} from "@vueuse/core";

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

let mindMap: MindMap;

onMounted(() => {
    if (!mindMapEditor.value) {
        return;
    }
    mindMap = new MindMap({
        // @ts-ignore
        el: mindMapEditor.value,
        theme: useGlobalStore().isDark ? 'dark' : 'default'
    });
    mindMap.setFullData(props.modelValue);
    mindMap.reRender(() => console.log("reRender"));
});

watch(() => size.width.value, () => mindMap && mindMap.reRender(() => console.log("reRender")));
watch(() => size.height.value, () => mindMap && mindMap.reRender(() => console.log("reRender")));

onUnmounted(() => {
    useSaveContentEvent.off(onSave);
    if (mindMap) {
        mindMap.destroy();
    }
});

useSaveContentEvent.on(onSave);

function onSave() {
    if (mindMap) {
        emits("update:modelValue", mindMap.getData(true));
    }
}

useIntervalFn(() => {
    // 每秒保存一次
    if (mindMap) {
        emits("update:modelValue", mindMap.getData(true));
    }
}, 1000)

</script>
<style scoped>
.mind-map-editor {
    width: 100%;
    height: 100%;
}
</style>
