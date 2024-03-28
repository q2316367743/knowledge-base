<template>
    <div class="white-board-editor" ref="parentRef">
        <canvas ref="containerRef" />
        <whiteboard-tool v-if="load"/>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
// 组件
import WhiteboardTool from '@/pages/home/layout/editor-content/editor/WhiteboardEditor/components/WhiteboardTool/index.vue'
import {
    WhiteboardEngine
} from "@/pages/home/layout/editor-content/editor/WhiteboardEditor/components/core/WhiteboardEngine";
import {useElementSize} from "@vueuse/core";

const props = defineProps({
    modelValue: {
        type: String,
        default: "",
        required: false
    },
    readOnly: Boolean,
    articleId: Number
});
const emits = defineEmits(['update:modelValue']);

const parentRef = ref();
const containerRef = ref();
const load = ref(false);

const size = useElementSize(parentRef);



onMounted(() => {
    const engine = new WhiteboardEngine(containerRef.value);

    watch(()=>size.height.value, () => engine.resize(size.width.value, size.height.value));
    watch(()=>size.width.value, () => engine.resize(size.width.value, size.height.value))


    load.value = true;
})


</script>
<style scoped>
.white-board-editor {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
