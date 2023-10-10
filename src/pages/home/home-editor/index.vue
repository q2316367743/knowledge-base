<template>
    <a-split class="home-editor" v-model:size="size" :min="min" :max="max" :disabled="disabled">
        <template #first>
            <editor-side/>
        </template>
        <template #second>
            <editor-content/>
        </template>
    </a-split>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import EditorSide from '@/pages/home/home-editor/editor-side.vue';
import EditorContent from "@/pages/home/home-editor/editor-content.vue";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useWindowSize} from "@vueuse/core";

const windowSize = useWindowSize();

const size = ref(useHomeEditorStore().width);
const min = computed(() => useHomeEditorStore().collapsed ? "0px" : "270px");
const max = computed(() => (windowSize.width.value - 350) + 'px');
const disabled = computed(() => size.value === '0px');

watch(() => size.value, value => useHomeEditorStore().setWidth(value));
watch(() => useHomeEditorStore().width, value => {
    if (value !== size.value) {
        size.value = value;
    }
});
</script>
<style lang="less">
.home-editor {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    .arco-split-pane {
        position: relative;
        width: 100%;
        height: 100%;
    }
}
</style>
