<template>
    <a-split class="editor" v-model:size="size" :min="min" :max="max" :disabled="disabled" v-if="isInit">
        <template #first>
            <editor-side/>
        </template>
        <template #second>
            <a-result :title="title" subtitle="点击文件进行编辑" status="404" v-if="selectKey === ''"
                      style="margin-top: 20vh;">
                <template #extra>
                    <a-button type="primary" @click="switchCollapsed()">
                        <template #icon>
                            <icon-menu/>
                        </template>
                    </a-button>
                </template>
            </a-result>
            <editor-container v-else-if="editorVisible"/>
        </template>
    </a-split>
    <a-result title="正在初始化编辑器驱动，请稍等" subtitle="点击文件进行编辑" status="info"
              style="margin-top: 20vh;" v-else>
        <template #icon>
            <icon-refresh spin/>
        </template>
    </a-result>
</template>
<script lang="ts" setup>
import {useEditorDriverStore} from "@/store/db/EditorDriverStore";
import {useWindowSize} from "@vueuse/core";
import {computed, nextTick, ref, watch} from "vue";
import EditorSide from "@/pages/editor/components/editor-side/index.vue";
import MessageUtil from "@/utils/MessageUtil";
import EditorContainer from "@/pages/editor/components/editor-container/index.vue";

const isInit = ref(false);

useEditorDriverStore().init()
        .then(rsp => console.log("是否实际完成初始化：", rsp))
        .catch(e => MessageUtil.error("初始化编辑器驱动失败", e))
        .finally(() => isInit.value = true);

const windowSize = useWindowSize();

const size = ref(useEditorDriverStore().width);
const editorVisible = ref(useEditorDriverStore().selectKey !== '');

const min = computed(() => useEditorDriverStore().collapsed ? "0px" : "270px");
const max = computed(() => (windowSize.width.value - 350) + 'px');
const disabled = computed(() => size.value === '0px');
const selectKey = computed(() => useEditorDriverStore().selectKey);
const driverId = computed(() => useEditorDriverStore().driverId);
const title = computed(() => driverId.value === 0 ? '请现在左上角选择工作空间' : '请在左侧选择文件');

watch(() => size.value, value => useEditorDriverStore().setWidth(value));
watch(() => useEditorDriverStore().width, value => {
    if (value !== size.value) {
        size.value = value;
    }
});
watch(() => useEditorDriverStore().selectKey, value => {
    editorVisible.value = false;
    if (value !== '') {
        nextTick(() => editorVisible.value = true);
    }
})

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
