<template>
    <div class="mind-map-tool" :style="{left: left}" :data-left="left">
        <div class="tool-btn" @click="back()" :class="!isStart ? 'active' : ''">
            <div class="tool-btn-icon">
                <icon-backward :size="18"/>
            </div>
            <div class="tool-btn-text">后退</div>
        </div>
        <div class="tool-btn" @click="forward()" :class="!isEnd ? 'active' : ''">
            <div class="tool-btn-icon">
                <icon-forward :size="18"/>
            </div>
            <div class="tool-btn-text">前进</div>
        </div>
        <a-divider direction="vertical"/>
        <div class="tool-btn" @click="insertNode()" :class="available && !isRoot && !isGeneralization ? 'active' : ''">
            <div class="tool-btn-icon">
                <icon-mind-mapping :size="18"/>
            </div>
            <div class="tool-btn-text">同级节点</div>
        </div>
        <div class="tool-btn" @click="insertChildNode()" :class="available && !isGeneralization ? 'active' : ''">
            <div class="tool-btn-icon">
                <icon-mind-mapping :size="18"/>
            </div>
            <div class="tool-btn-text">子节点</div>
        </div>
        <div class="tool-btn" @click="deleteNode()" :class="available ? 'active' : ''">
            <div class="tool-btn-icon">
                <icon-delete :size="18"/>
            </div>
            <div class="tool-btn-text">删除节点</div>
        </div>
        <a-divider direction="vertical"/>
        <div class="tool-btn" :class="available ? 'active' : ''" @click="setImage()">
            <div class="tool-btn-icon">
                <icon-image :size="18"/>
            </div>
            <div class="tool-btn-text">图片</div>
        </div>
        <div class="tool-btn" :class="available ? 'active' : ''" @click="setHyperlink()">
            <div class="tool-btn-icon">
                <icon-link :size="18"/>
            </div>
            <div class="tool-btn-text">超链接</div>
        </div>
        <div class="tool-btn" :class="available ? 'active' : ''" @click="setNote()">
            <div class="tool-btn-icon">
                <icon-notification :size="18"/>
            </div>
            <div class="tool-btn-text">备注</div>
        </div>
        <div class="tool-btn" :class="available ? 'active' : ''" @click="setTag()">
            <div class="tool-btn-icon">
                <icon-tags :size="18"/>
            </div>
            <div class="tool-btn-text">标签</div>
        </div>
        <div class="tool-btn" :class="available ? 'active' : ''" @click="setIcon()">
            <div class="tool-btn-icon">
                <icon-face-smile-fill :size="18"/>
            </div>
            <div class="tool-btn-text">图标</div>
        </div>
        <a-divider direction="vertical"/>
        <div class="tool-btn" :class="available && !isRoot && !isGeneralization ? 'active' : ''" @click="insertGeneralization()">
            <div class="tool-btn-icon">
                <icon-apps :size="18"/>
            </div>
            <div class="tool-btn-text">概要</div>
        </div>
        <div class="tool-btn" :class="available && !isRoot && !isGeneralization ? 'active' : ''"
             @click="insertAssociativeLine()">
            <div class="tool-btn-icon">
                <icon-branch :size="18"/>
            </div>
            <div class="tool-btn-text">关联线</div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import {computed, onBeforeUnmount, PropType, ref, shallowRef} from "vue";
import MindMap from "simple-mind-map";
import {
    openInsertImage
} from "@/editor/MindMapEditor/components/MindMapTool/func/InsertImage";
import {MindMapNode} from "@/editor/MindMapEditor/domain";
import {
    openInsertHyperlink
} from "@/editor/MindMapEditor/components/MindMapTool/func/InsertHyperlink";
import {
    openInsertRemark
} from "@/editor/MindMapEditor/components/MindMapTool/func/InsertRemark";
import {
    openInsertTag
} from "@/editor/MindMapEditor/components/MindMapTool/func/InsertTag";
import {
    openInsertIcon
} from "@/editor/MindMapEditor/components/MindMapTool/func/InsertIcon";

const props = defineProps({
    mindMap: Object as PropType<MindMap>,
    width: Number
});
// 记录前进回退
const isStart = ref(true);
const isEnd = ref(true);
// 当前激活的节点列表
const activeNodes = shallowRef<Array<MindMapNode>>([]);


const left = computed(() => ((Math.max(props.width || 0, 686) - 686) / 2) + 'px');
const available = computed(() => activeNodes.value.length > 0);
const isRoot = computed(() => activeNodes.value.length > 0 && activeNodes.value.every(e => e.isRoot));
const isGeneralization = computed(() =>
    activeNodes.value.length > 0 && activeNodes.value.every((e: { isGeneralization: boolean }) => e.isGeneralization));


const nodeActive = (node: any, nodeList: Array<MindMapNode>) => {
    activeNodes.value = nodeList;
};
const backForward = (index: number, len: number) => {
    isStart.value = index <= 0;
    isEnd.value = index >= len - 1;
};

// 监听节点激活事件
props.mindMap && props.mindMap.on('node_active', nodeActive);
// 前进回退事件
props.mindMap && props.mindMap.on('back_forward', backForward);

onBeforeUnmount(() => {
    props.mindMap && props.mindMap.off('node_active', nodeActive);
    props.mindMap && props.mindMap.off('back_forward', backForward);
})

// 回退
const back = () => {
    if (!isStart.value) {
        props.mindMap && props.mindMap.execCommand('BACK');

    }
}

// 前进
const forward = () => {
    if (!isEnd.value)
        props.mindMap && props.mindMap.execCommand('FORWARD')
}

// 插入兄弟节点
const insertNode = () => {
    if (available.value && !isRoot.value && !isGeneralization.value)
        props.mindMap && props.mindMap.execCommand('INSERT_NODE')
}

// 插入子节点
const insertChildNode = () => {
    if (available.value && !isGeneralization.value)
        props.mindMap && props.mindMap.execCommand('INSERT_CHILD_NODE')
}

// 删除节点
const deleteNode = () => {
    if (available.value)
        props.mindMap && props.mindMap.execCommand('REMOVE_NODE')
}

// 设置图片
const setImage = () => {
    if (available.value)
        openInsertImage(activeNodes.value);
}

const setHyperlink = () => {
    if (available.value) {
        openInsertHyperlink(activeNodes.value);
    }
}

const setNote = () => {
    if (available.value) {
        openInsertRemark(activeNodes.value);
    }
}

const setTag = () => {
    if (available.value && props.mindMap) {
        openInsertTag(activeNodes.value, props.mindMap);
    }
}

const setIcon = () => {
    if (available.value) {
        openInsertIcon(activeNodes.value);
    }
}

const insertGeneralization = () => {
    if (available.value && !isRoot.value && props.mindMap && !isGeneralization.value) {
        props.mindMap.execCommand('ADD_GENERALIZATION');
    }
}

const insertAssociativeLine = () => {
    if (available.value && !isRoot.value && props.mindMap && !isGeneralization.value) {
        // @ts-ignore
        props.mindMap.associativeLine.createLineFromActiveNode()
    }
}

</script>
<style scoped lang="less">
.mind-map-tool {
    position: absolute;
    top: 10px;

    display: flex;
    background-color: var(--color-fill-2);
    padding: 10px 20px;
    border-radius: 2px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--color-border-2);
    flex-shrink: 0;

    .tool-btn {
        height: 45px;
        margin-right: 20px;
        cursor: no-drop;
        color: var(--color-neutral-4);
        user-select: none;

        &:last-child {
            margin-right: 0;
        }

        .tool-btn-icon {
            text-align: center;
        }

        .tool-btn-text {
            margin-top: 7px;
            font-size: 0.8em;
        }

        &.active {
            cursor: pointer;
            color: var(--color-text-1);
        }
    }
}
</style>
