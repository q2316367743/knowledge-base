<template>
    <a-split class="home-editor" v-model:size="size" :min="min" :max="max" :disabled="disabled">
        <template #first>
            <editor-side/>
        </template>
        <template #second>
            <a-result title="请在左侧选择文章" subtitle="点击加号创建文章" status="404" v-if="id === 0">
                <template #extra>
                    <a-button type="primary" @click="switchCollapsed()">
                        <template #icon>
                            <icon-menu />
                        </template>
                    </a-button>
                </template>
            </a-result>
            <editor-content v-else/>
        </template>
    </a-split>
</template>
<script lang="ts" setup>
import {computed, ref, watch} from "vue";
import EditorSide from '@/pages/home/layout/editor-side/index.vue';
import EditorContent from "@/pages/home/layout/editor-content/index.vue";
import {useHomeEditorStore} from "@/store/components/HomeEditorStore";
import {useWindowSize} from "@vueuse/core";

const windowSize = useWindowSize();

const size = ref(useHomeEditorStore().width);
const min = computed(() => useHomeEditorStore().collapsed ? "0px" : "270px");
const max = computed(() => (windowSize.width.value - 350) + 'px');
const disabled = computed(() => size.value === '0px');
const id = computed(() => useHomeEditorStore().id)

watch(() => size.value, value => useHomeEditorStore().setWidth(value));
watch(() => useHomeEditorStore().width, value => {
    if (value !== size.value) {
        size.value = value;
    }
});

const switchCollapsed = () => useHomeEditorStore().switchCollapsed();
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
