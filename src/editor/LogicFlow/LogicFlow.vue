<template>
    <div class="diagram">
        <!-- 顶部菜单栏 -->
        <div class="container">
            <a-layout>
                <!-- 侧边工具栏 -->
                <a-layout-sider hide-trigger collapsible :collapsed="collapsed || readOnly" :collapsed-width="0"
                                :width="206">
                    <logic-flow-sidebar v-if="render" @drag-in-node="dragInNode"/>
                </a-layout-sider>
                <a-layout>
                    <!-- 内容 -->
                    <div class="content" id="logic-flow-view"></div>
                    <!-- 左上角工具栏、属性栏 -->
                    <div class="toolbar">
                        <diagram-toolbar v-if="render" :lf="lf" :active-edges="activeEdges" :readonly="readonly"/>
                    </div>
                    <div class="collapsed">
                        <!-- 折叠按钮 -->
                        <a-button @click="collapsed = !collapsed" type="primary" v-if="!readonly">
                            <template #icon>
                                <icon-menu-unfold v-if="collapsed"/>
                                <icon-menu-fold v-else/>
                            </template>
                        </a-button>
                    </div>
                    <!-- 右侧属性面板 -->
                    <logic-flow-panel class="panel"/>
                </a-layout>
            </a-layout>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {ref, shallowRef} from "vue";
import LogicFlowSidebar from "@/editor/LogicFlow/components/LogicFlowSidebar.vue";
import LogicFlowPanel from "@/editor/LogicFlow/components/LogicFlowPanel.vue";
import {LogicFlowWrapper} from "@/editor/LogicFlow/LogicFlowWrapper";

const content = defineModel({
    type: String,
    default: ''
})

const props = defineProps({
    readOnly: {
        type: Boolean,
        default: false
    },
    articleId: Number
});

const render = ref(false);
const collapsed = ref(false);

const instance = shallowRef<LogicFlowWrapper>();

function dragInNode(type: string) {
    instance.value?.lf.dnd.startDrag({
        type
    })
}
</script>
<style lang="less" scoped>
.diagram {
    position: relative;
    height: 100%;
    width: 100%;

    .header {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 32px;
        border-bottom: 1px solid var(--color-neutral-3);
    }

    .container {
        position: absolute;
        top: 33px;
        left: 0;
        right: 0;
        bottom: 0;

        .content {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }

    .arco-layout {
        position: relative;
        overflow: hidden;
    }

    .toolbar {
        position: absolute;
        top: 0;
        left: 10px;
    }

    .collapsed {
        position: absolute;
        left: 10px;
        bottom: 10px;
    }

    .panel {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        padding: 7px;
        background-color: var(--color-bg-1);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        overflow: auto;
    }
}
</style>
