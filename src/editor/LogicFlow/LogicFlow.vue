<template>
    <div class="logic-flow" ref="logicFlowRef">
        <div class="logic-flow-container">
            <!-- 画布 -->
            <div ref="containerRef" class="logic-flow-content"/>
            <!-- 左侧边栏 -->
            <div class="sidebar" v-if="!readOnly">
                <logic-flow-sidebar v-if="instance" :lf="instance" :diagram-groups="diagramNodes" @save="onSave"/>
            </div>
            <!-- 左上角工具栏、属性栏 -->
            <div class="toolbar">
                <logic-flow-toolbar v-if="instance" :lf="instance" :active-edges="activeEdges"
                                    :readonly="readOnly"/>
            </div>
            <!-- 保存按钮 -->
            <div class="save" v-if="!readOnly">
                <logic-flow-save :saved @save="onSave"/>
            </div>
            <!-- 右侧属性面板 -->
            <div class="panel" v-if="showPanel">
                <logic-flow-panel v-show="!readOnly" :onlyEdge="activeNodes.length === 0"
                                  :elements-style="properties"
                                  @set-style="setStyle" @@set-level="setZIndex"/>
            </div>
            <!-- 右侧配置面板 -->
            <div class="config">
                <a-dropdown>
                    <a-button type="text" :disabled="readOnly">更多</a-button>
                    <template #content>
                        <a-doption @click="onOpenOption">功能配置</a-doption>
                        <a-doption @click="onOpenEditConfig">编辑配置</a-doption>
                        <a-doption @click="openLogicFlowKeyboard">快捷键</a-doption>
                    </template>
                </a-dropdown>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch} from "vue";
import {LogicFlow} from "@logicflow/core";
import {BpmnElement, BpmnXmlAdapter, Menu, MiniMap, SelectionSelect, Snapshot,} from '@logicflow/extension';
import {useElementSize} from "@vueuse/core";
import {registerCustomElement} from "@/editor/LogicFlow/node";
import {DefaultTheme} from "@/editor/LogicFlow/theme";
// 组件
import LogicFlowSidebar from "@/editor/LogicFlow/components/LogicFlowSidebar.vue";
import LogicFlowToolbar from "@/editor/LogicFlow/components/LogicFlowToolbar.vue";
import LogicFlowSave from "@/editor/LogicFlow/components/LogicFlowSave.vue";
import LogicFlowPanel from "@/editor/LogicFlow/components/LogicFlowPanel.vue";
import {buildLogicFlowConfigFromOptions, firstUseLogicFlow, onLogicFlowExport} from "@/editor/LogicFlow/func";
import {useArticleExportEvent} from "@/store/components/HomeEditorStore";
import {assign} from "radash";
import {LogicFlowOption, updateLogicFlowOption} from "@/editor/LogicFlow/components/LogicFlowOption";
import {updateLogicFlowEditConfig} from "@/editor/LogicFlow/components/LogicFlowEditConfig";
import {openLogicFlowKeyboard} from "@/editor/LogicFlow/components/LogicFlowKeyboard";

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

// 实例数据
const logicFlowRef = ref<HTMLDivElement>();
const containerRef = ref<HTMLDivElement>();
const instance = shallowRef<LogicFlow>();

// 状态数据
const saved = ref(true);

const elementSize = useElementSize(logicFlowRef);

// 画布数据
const diagramNodes = ref<any[]>([]);
const activeEdges = ref<any[]>([]);
const activeNodes = ref<any[]>([]);
const properties = ref<any>()

// 配置数据
const config = ref({});
const option = ref<LogicFlowOption>({
    miniMap: true,
    grid: 'empty',
    gridSize: 10,
    gridVisible: true,
    gridConfigColor: '#000000',
    gridConfigThickness: 1
});
const editConfig = ref<any>({});

const showPanel = computed(() => {
    // 选中元素、不是只读、有属性，显示属性面板
    return (activeNodes.value.length > 0 || activeEdges.value.length > 0) && !props.readOnly && properties.value;
})

watch([elementSize.width, elementSize.height], () => {
    instance.value && instance.value.resize(elementSize.width.value, elementSize.height.value);
});
watch(() => props.readOnly, value => {
    // 切换只读，自动保存
    onSave();
    instance.value && instance.value.updateEditConfig({
        isSilentMode: value
    });
}, {immediate: true})

const toolbarTop = computed(() => (elementSize.height.value - 146) / 2 + 'px');

onMounted(() => {
    if (!containerRef.value) {
        return;
    }
    const data = content.value['data'] || {};
    config.value = content.value['config'] || {}
    option.value = assign(option.value, content.value['option'])
    editConfig.value = content.value['editConfig'] || {}
    instance.value = new LogicFlow({
        container: containerRef.value,
        plugins: [BpmnElement, BpmnXmlAdapter, Snapshot, SelectionSelect, MiniMap, Menu],
        width: elementSize.width.value,
        height: elementSize.height.value,
        isSilentMode: props.readOnly,
        keyboard: {
            enabled: true,
        },
        snapline: true,
        background: {
            backgroundImage: 'var(--color-bg-1)'
        },
        ...buildLogicFlowConfigFromOptions(option.value)
    });
    // 初始化赋值
    registerCustomElement(instance.value).then(nodes => diagramNodes.value = nodes);
    instance.value.setDefaultEdgeType('pro-polyline');
    instance.value.renderRawData(data);
    instance.value.setTheme(DefaultTheme);
    instance.value.resize(elementSize.width.value, elementSize.height.value);
    instance.value.updateEditConfig(editConfig.value);
    // 初始化配置
    initOption();
    // 画布事件监听
    instance.value.on('selection:selected,node:click,blank:click,edge:click', () => {
        if (!instance.value) {
            return;
        }
        const {nodes, edges} = instance.value.getSelectElements()
        activeNodes.value = nodes
        activeEdges.value = edges
        getProperty();
    });
    instance.value.on('node:drag,node:delete,node:add,node:dnd-add,edge:add,edge:delete,edge:adjust', () => {
        saved.value = false;
    });
    // 监听键盘事件
    document.addEventListener('keydown', onKeyboardEvent);
    useArticleExportEvent.off(onExport);
    useArticleExportEvent.on(onExport);
});
onBeforeUnmount(() => {
    document.removeEventListener('keydown', onKeyboardEvent);
    useArticleExportEvent.off(onExport);
});

function getProperty() {
    // 清空属性面板
    properties.value = undefined;
    nextTick(() => {
        // 获取选中元素的属性
        let value = {}
        activeNodes.value.forEach(node => {
            value = {...properties.value, ...node.properties}
        })
        activeEdges.value.forEach(edge => {
            value = {...properties.value, ...edge.properties}
        })
        properties.value = value
    })
}

function onSave() {
    if (!instance.value) {
        return;
    }
    saved.value = true;
    content.value = {
        data: instance.value.getGraphRawData(),
        config: config.value,
        option: option.value,
        editConfig: editConfig.value
    }
}

function setStyle(item: any) {
    activeNodes.value.forEach(({id}) => {
        instance.value && instance.value.setProperties(id, item)
    })
    activeEdges.value.forEach(({id}) => {
        instance.value && instance.value.setProperties(id, item)
    })
}

function setZIndex(type: any) {
    activeNodes.value.forEach(({id}) => {
        instance.value && instance.value.setElementZIndex(id, type)
    })
    activeEdges.value.forEach(({id}) => {
        instance.value && instance.value.setElementZIndex(id, type)
    })
}

function onKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        onSave();
    }else if (event.key === 'm' && (event.ctrlKey || event.metaKey)) {
        option.value.miniMap = !option.value.miniMap;
        initOption();
        onSave();
    }else if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
        instance.value && instance.value.history.undo();
    }
}

function onExport(id: number) {
    onLogicFlowExport(id, props.articleId || 0, instance.value);
}

function initOption() {
    if (!instance.value) {
        return;
    }
    if (option.value.miniMap) {
        // @ts-ignore
        instance.value.extension.miniMap.show();
    } else {
        // @ts-ignore
        instance.value.extension.miniMap.hide();
    }
}

function onOpenOption() {
    updateLogicFlowOption(option, () => {
        onSave();
        initOption();
    });
}

function onOpenEditConfig() {
    updateLogicFlowEditConfig(editConfig, () => {
        if (instance.value) {
            instance.value.updateEditConfig(editConfig.value);
        }
        onSave();
    });
}

// 首次使用，打开帮助说明
firstUseLogicFlow();
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

        .sidebar {
            position: absolute;
            top: v-bind(toolbarTop);
            left: 8px;
        }

        .toolbar {
            position: absolute;
            top: 8px;
            left: 8px;
        }

        .panel {
            position: absolute;
            top: 42px;
            right: 8px;
        }

        .config {
            position: absolute;
            left: 8px;
            bottom: 8px;
            background-color: var(--color-bg-1);
            border-radius: var(--border-radius-medium);
            border: 1px solid var(--color-border-2);
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);;
        }


        .save {
            position: absolute;
            right: 8px;
            top: 8px;
        }

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

    .lf-mini-map {
        background: var(--color-fill-2) !important;
    }
}
</style>
