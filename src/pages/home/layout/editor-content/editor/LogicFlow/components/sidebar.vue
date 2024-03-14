<template>
    <div class="diagram-sidebar">
        <a-collapse :bordered="false" v-model:active-key="activeKeys">
            <a-collapse-item v-for="group in diagramGroups" :header="group.name" :key="group.key">
                <div v-for="node in group.nodes" class="node-item" @mousedown="dragInNode(node.name)">
                    <a-tooltip :content="node.tip">
                        <component :is="node.icon" class="svg-node"/>
                    </a-tooltip>
                </div>
            </a-collapse-item>
        </a-collapse>
    </div>
</template>
<script lang="ts" setup>
import {PropType, ref} from 'vue'
import {DiagramGroup} from "../node/data/DiagramNode";
import {registerCustomElement} from "@/pages/home/layout/editor-content/editor/LogicFlow/node";
import LogicFlow from "@logicflow/core";


const props = defineProps({
    lf: Object as PropType<LogicFlow>
});

const emits = defineEmits(['drag-in-node']);

const diagramGroups = ref<Array<DiagramGroup>>([]);
const activeKeys = ref(['basic-node', 'lct']);

if (props.lf) {
    registerCustomElement(props.lf).then(res => diagramGroups.value = res);
}


function dragInNode(type: any) {
    if (props.lf) {
        props.lf.dnd.startDrag({type});
    }
}

</script>

<style lang="less">
.diagram-sidebar {
    user-select: none;
    position: absolute;
    width: 205px;
    border-right: 1px solid var(--color-neutral-3);

    .sidebar-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 32px;
        overflow: auto;
    }

    .sidebar-more {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        height: 32px;
    }

    .arco-collapse-item-content {
        padding: 0;
    }

    .node-item {
        width: 35px;
        height: 35px;
        margin-left: 3px;
        margin-right: 2px;
        display: inline-block;

        &:hover {
            cursor: grab;
            filter: brightness(90%);
        }

        &:active {
            cursor: grabbing;
            border: none;
        }
    }

    .svg-node {
        left: 1px;
        top: 1px;
        width: 32px;
        height: 30px;
        display: block;
        position: relative;
        overflow: hidden;

        &:focus {
            border: none;
        }
    }

    .image-node,
    .icon-node {
        display: inline-block;
        width: 30px;
        height: 30px;
        margin: 10px;
        cursor: pointer;
    }

}

.more-trigger {
    background-color: var(--color-fill-1);
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    padding: 7px 0;
}
</style>
