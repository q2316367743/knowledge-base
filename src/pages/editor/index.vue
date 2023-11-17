<template>
    <a-split class="editor" v-model:size="size" :min="min" :max="max" :disabled="disabled">
        <template #first>
            <div>侧边栏</div>
        </template>
        <template #second>
            <a-result title="请在左侧选择文章" subtitle="点击文章进行编辑" status="404" v-if="selectKey === ''" style="margin-top: 20vh;">
                <template #extra>
                    <a-button type="primary" @click="switchCollapsed()">
                        <template #icon>
                            <icon-menu/>
                        </template>
                    </a-button>
                </template>
            </a-result>
            <div v-else/>
        </template>
    </a-split>
</template>
<script lang="ts" setup>
import {useEditorDriverStore} from "@/store/db/EditorDriverStore";
import {useWindowSize} from "@vueuse/core";
import {computed, ref, watch} from "vue";

useEditorDriverStore().init();

const windowSize = useWindowSize();

const size = ref(useEditorDriverStore().width);
const min = computed(() => useEditorDriverStore().collapsed ? "0px" : "270px");
const max = computed(() => (windowSize.width.value - 350) + 'px');
const disabled = computed(() => size.value === '0px');
const selectKey = computed(() => useEditorDriverStore().selectKey);

watch(() => size.value, value => useEditorDriverStore().setWidth(value));
watch(() => useEditorDriverStore().width, value => {
    if (value !== size.value) {
        size.value = value;
    }
});

const switchCollapsed = () => useEditorDriverStore().switchCollapsed();

</script>
<style lang="less">
.editor {
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
