<template>
    <a-layout class="logic-flow">
        <a-layout-sider :collapsed="collapsed || props.readOnly" :collapsed-width="0">
            <sidebar :lf="lf" v-if="lf && !collapsed && !props.readOnly"/>
        </a-layout-sider>
        <a-layout-content>
            <div class="content" ref="container">
                <div class="container" ref="target"></div>
                <a-button type="primary" class="collapsed" @click="collapsed = !collapsed" v-if="!props.readOnly">
                    <template #icon>
                        <icon-menu-unfold v-if="collapsed"/>
                        <icon-menu-fold v-else/>
                    </template>
                </a-button>
            </div>
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import {onMounted, ref, shallowRef, watch} from "vue";
import LogicFlow from "@logicflow/core";
import {useElementSize} from "@vueuse/core";
import './icon'
import {BpmnElement, BpmnXmlAdapter, Menu, MiniMap, SelectionSelect, Snapshot} from "@logicflow/extension";
import {DefaultTheme} from "@/pages/home/layout/editor-content/editor/LogicFlow/theme";
import Sidebar from "@/pages/home/layout/editor-content/editor/LogicFlow/components/sidebar.vue";
import {originalConfig, silentConfig} from "@/pages/home/layout/editor-content/editor/LogicFlow/constants";

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

const collapsed = ref(false);
const container = ref<HTMLDivElement>();
const target = ref<HTMLDivElement>();
const lf = shallowRef<LogicFlow>()

const size = useElementSize(container);

onMounted(() => {
    if (!target.value) {
        return;
    }
    lf.value = new LogicFlow({
        container: target.value,
        plugins: [BpmnElement, BpmnXmlAdapter, Snapshot, SelectionSelect, MiniMap, Menu],
        width: size.width.value,
        height: size.height.value
    });
    lf.value.setDefaultEdgeType('pro-polyline');
    lf.value.renderRawData(props.modelValue['record']);
    lf.value.setTheme(DefaultTheme);
    switchReadOnly()

});

watch(() => size.height.value, () => lf.value && lf.value.resize(size.width.value, size.height.value))
watch(() => size.width.value, () => lf.value && lf.value.resize(size.width.value, size.height.value))
watch(() => props.readOnly, () => switchReadOnly());

function switchReadOnly() {
    if (!lf.value) {
        return;
    }
    if (props.readOnly) {
        lf.value.updateEditConfig(silentConfig);
    } else {
        lf.value.updateEditConfig(originalConfig);
    }
}

</script>
<style lang="less">
@import "./index.less";
</style>
