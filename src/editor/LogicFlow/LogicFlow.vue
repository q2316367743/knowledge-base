<template>
    <div class="logic-flow" ref="logicFlowRef">
        <a-layout class="logic-flow-container">
            <a-layout-sider :width="240">
                <logic-flow-sidebar
                    v-if="render" :diagram-groups="diagramNodes" v-model:node-keys="option.nodeKeys"
                    v-model:active-node-keys="option.activeNodeKeys" :height="elementSize.height.value"
                    @drag-in-node="dragInNode"></logic-flow-sidebar>
            </a-layout-sider>
            <a-layout-content>
                <div ref="containerRef" class="logic-flow-content"/>
            </a-layout-content>
        </a-layout>
    </div>
</template>
<script lang="ts" setup>
import {onMounted, ref, shallowRef, watch} from "vue";
import {LogicFlow} from "@logicflow/core";
import {BpmnElement, BpmnXmlAdapter, Menu, MiniMap, SelectionSelect, Snapshot,} from '@logicflow/extension';
import {useElementSize} from "@vueuse/core";
import {registerCustomElement} from "@/editor/LogicFlow/node";
import {DefaultTheme} from "@/editor/LogicFlow/theme";
import LogicFlowSidebar from "@/editor/LogicFlow/components/LogicFlowSidebar.vue";

const content = defineModel({
    type: Object,
    default: {}
})

const props = defineProps({
    readOnly: {
        type: Boolean,
        default: false
    },
    articleId: Number
});

const logicFlowRef = ref<HTMLDivElement>()
const containerRef = ref<HTMLDivElement>()
const instance = shallowRef<LogicFlow>();
const render = ref(false)
const option = ref({
    nodeKeys: [],
    activeNodeKeys: []
})

const elementSize = useElementSize(logicFlowRef);

const diagramNodes = ref<any[]>([]);

watch([elementSize.width, elementSize.height], () => {
    instance.value && instance.value.resize(elementSize.width.value, elementSize.height.value);
});

onMounted(() => {
    if (!containerRef.value) {
        return;
    }
    const data = content.value['data'] || {};
    const config = content.value['config'] || {}
    option.value = content.value['option'] || {};
    instance.value = new LogicFlow({
        container: containerRef.value,
        plugins: [BpmnElement, BpmnXmlAdapter, Snapshot, SelectionSelect, MiniMap, Menu],
        width: elementSize.width.value,
        height: elementSize.height.value,
        ...config
    });
    render.value = true;
    registerCustomElement(instance.value).then(nodes => diagramNodes.value = nodes);
    instance.value.setDefaultEdgeType('pro-polyline');
    instance.value.renderRawData(data);
    instance.value.setTheme(DefaultTheme);
    instance.value.resize(elementSize.width.value, elementSize.height.value);
});

function dragInNode(type: string) {
    if (!instance.value) {
        return;
    }
    instance.value.dnd.startDrag({
        type
    })
}
</script>
<style lang="less">
.logic-flow {
    position: relative;
    width: 100%;
    height: 100%;

    .logic-flow-container {
        position: relative;
        width: 100%;
        height: 100%;

        .logic-flow-content {
            width: 100%;
            height: 100%;
        }
    }

    .arco-layout-content {
        overflow: hidden;
    }

    .lf-graph {
        background-color: var(--color-bg-1) !important;

        .lf-text-input {
            background-color: var(--color-bg-1) !important;
            color: var(--color-text-1);
        }
    }

    .bpmn-pattern {
        background-color: var(--color-bg-3);
        color: var(--color-text-1);
    }

    .lf-control {
        background-color: var(--color-bg-3);
        color: var(--color-text-1);
    }

    .lf-control-item:hover {
        background-color: var(--color-neutral-4);

    }

    .lf-menu {
        background-color: var(--color-bg-1) !important;
        color: var(--color-text-1);
    }

    .lf-menu-item:hover {
        background-color: var(--color-neutral-4) !important;
    }
}
</style>
