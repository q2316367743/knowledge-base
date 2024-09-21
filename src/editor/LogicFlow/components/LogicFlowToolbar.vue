<template>
    <div class="diagram-toolbar">
        <div class="toolbar-item" @click="zoomIn()">
            <icon-zoom-in :size="18"/>
        </div>
        <div class="toolbar-item" @click="zoomOut()">
            <icon-zoom-out :size="18"/>
        </div>
        <div class="toolbar-item" :class="{ 'disabled': !undoAble }" @click="undo()" v-if="!readonly">
            <icon-undo :size="18"/>
        </div>
        <div class="toolbar-item" :class="{ 'disabled': !redoAble }" @click="redo()" v-if="!readonly">
            <icon-redo :size="18"/>
        </div>
        <div class="toolbar-item" :class="{ 'selection-active': selectionOpened }" @click="selectionSelect()"
             v-if="!readonly">
            <icon-fullscreen :size="18"/>
        </div>
        <div v-if="!readonly">
            <a-select v-model="linetype" size="mini" @change="changeLineType">
                <a-option v-for="item in lineOptions" :key="item.value" :value="item.value"
                          :label="item.label"></a-option>
            </a-select>
        </div>
    </div>
</template>

<script lang="ts">
import {useKeyModifier} from '@vueuse/core'
import {defineComponent, PropType} from 'vue'
import {LogicFlow} from "@logicflow/core";

export default defineComponent({
    name: 'LogicFlowToolbar',
    props: {
        lf: Object as PropType<LogicFlow>,
        activeEdges: Array<any>,
        readonly: Boolean
    },
    data: () => ({
        selectionOpened: false,
        undoAble: false,
        redoAble: false,
        colors: '#345678',
        linetype: 'pro-polyline',
        lineOptions: [
            {
                value: 'pro-polyline',
                label: '折线'
            },
            {
                value: 'pro-line',
                label: '直线'
            },
            {
                value: 'pro-bezier',
                label: '曲线'
            }
        ],
        control: useKeyModifier('Control')
    }),
    watch: {
        control() {
            this.selectionOpened = !(this.control || false);
            this.selectionSelect();
        }
    },
    created() {
        if (this.lf) {
            this.lf.on('history:change', e => {
                this.undoAble = e.data.undoAble
                // @ts-ignore
                this.redoAble = e.data.redoAble
            })
        }
    },
    methods: {
        zoomIn() {
            if (this.lf) {
                this.lf.zoom(true)
            }
        },
        zoomOut() {
            if (this.lf) {
                this.lf.zoom(false)
            }
        },
        undo() {
            if (this.lf && this.undoAble) {
                this.lf.undo()
            }
        },
        redo() {
            if (this.lf && this.redoAble) {
                this.lf.redo()
            }
        },
        selectionSelect() {
            this.selectionOpened = !this.selectionOpened
            if (this.lf) {
                if (this.selectionOpened) {
                    // @ts-ignore
                    this.lf.extension.selectionSelect.openSelectionSelect()
                } else {
                    // @ts-ignore
                    this.lf.extension.selectionSelect.closeSelectionSelect()
                }
            }
        },
        changeLineType(value: any) {
            if (this.lf) {
                const {lf, activeEdges} = this
                const {graphModel} = lf
                this.lf.setDefaultEdgeType(value)
                if (activeEdges && activeEdges.length > 0) {
                    activeEdges.forEach(edge => {
                        graphModel.changeEdgeType(edge.id, value)
                    })
                }
            }
        }
    },
})
</script>

<style scoped lang="less">
.diagram-toolbar {

    .toolbar-item {
        width: 18px;
        height: 18px;
        float: left;
        margin: 12px 4px;
        cursor: pointer;
        color: var(--color-text-2);

        &.disabled {
            color: var(--color-text-4);
        }
    }

}

.selection-active {
    background: #33a3dc;
}
</style>
