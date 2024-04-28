<template>
    <a-layout class="handsontable-editor-wrap abs-0">
        <a-layout-header class="header">
            <a-button-group type="text" class="w-full">
                <div class="flex justify-between w-full">
                    <a-space>
                        <a-button @click="updateColumnsWrap()">修改列</a-button>
                    </a-space>
                    <a-space>
                        <a-button>
                            <template #icon>
                                <icon-settings/>
                            </template>
                        </a-button>
                    </a-space>
                </div>
            </a-button-group>
        </a-layout-header>
        <a-layout-content class="content">
            <div ref="containerRef"></div>
        </a-layout-content>
    </a-layout>
</template>
<script lang="ts" setup>
import {onMounted, ref, shallowRef, toRaw, watch} from "vue";
import Handsontable from 'handsontable';
import {registerLanguageDictionary, zhCN} from 'handsontable/i18n';
import {CellChange, ChangeSource} from "handsontable/common";
import {ColumnSettings} from "handsontable/settings";
import {updateColumns} from "@/pages/home/layout/editor-content/editor/HandsontableEditor/columns";
import {clone} from "xe-utils";

registerLanguageDictionary(zhCN)

const props = defineProps({
    modelValue: Object,
    readOnly: Boolean,
    articleId: Number
});
const emits = defineEmits(['update:modelValue']);

const containerRef = ref<HTMLElement>();
const hot = shallowRef<Handsontable | null>(null);
const data = ref<Array<Array<string>>>(props.modelValue ? (props.modelValue.data || [["", "", "", "", "", ""]]) : [["", "", "", "", "", ""]]);
const columns = ref<Array<ColumnSettings> | null>(props.modelValue ? (props.modelValue.columns ? (props.modelValue.columns.length === 0 ? null : props.modelValue.columns) : null) : null);

onMounted(() => {
    if (!containerRef.value) {
        return;
    }
    hot.value = new Handsontable(containerRef.value, {
        data: data.value,
        rowHeaders: true,
        colHeaders: true,
        height: '100%',
        width: '100%',
        autoWrapRow: true,
        autoWrapCol: true,
        contextMenu: true,
        allowInsertColumn: true,
        allowInsertRow: true,
        allowRemoveRow: true,
        allowRemoveColumn: true,
        manualRowMove: false,
        manualRowResize: true,
        manualColumnMove: false,
        manualColumnResize: true,
        licenseKey: 'non-commercial-and-evaluation',
        readOnly: props.readOnly,
        language: zhCN.languageCode,
        columns: columns.value as any,
        afterChange(changes: Array<CellChange> | null, source: ChangeSource) {
            console.log(changes, source)
            if (source === 'loadData') {
                return; // don't save this change
            }
            if (!changes) {
                return;
            }
            if (changes.every(change => change[2] === change[3])) {
                // 没变化
                return;
            }
            for (let change of changes) {
                if (change[2] === change[3]) {
                    // 没变化
                    continue;
                }
                const row = data.value[change[0]] || [];
                row[change[1] as number] = change[3];
                data.value[change[0]] = row;
            }
            updateModelValue();
        },
        afterColumnMove(movedColumns: number[], finalIndex: number, dropIndex: number | undefined, movePossible: boolean, orderChanged: boolean) {
            console.log(movedColumns, finalIndex, dropIndex, movePossible);
            const minColumn = Math.min(...movedColumns);
            const maxColumn = Math.max(...movedColumns);
            const startIndex = Math.min(minColumn, finalIndex, dropIndex || 0);
            const endIndex = Math.max(maxColumn, finalIndex, dropIndex || 0);
            // true: 从前往后
            const direct = Math.max(...movedColumns) <= finalIndex;
            console.log(minColumn, maxColumn, startIndex, endIndex, direct);
            for (let row of data.value) {
                const notMoveColumn = row.slice(maxColumn + 1, direct ? endIndex : minColumn);
                const moveColumn = row.slice(minColumn, maxColumn + 1);
                let move: Array<string>;
                if (direct) {
                    move = [...notMoveColumn, ...moveColumn];
                } else {
                    move = [...moveColumn, ...notMoveColumn];
                }
                const currentRow = [...row.slice(0, startIndex), ...move, ...row.slice(endIndex, row.length)];
                console.log('方向：', direct, `不移动，进改变位置：（${maxColumn + 1}，${direct ? endIndex : minColumn}）`, notMoveColumn, "，移动中：", moveColumn)
                console.log('开始：', row.slice(0, startIndex), '，移动：', move, '，结尾', row.slice(endIndex, row.length), '，最终：', currentRow)
            }
        },
        afterRowMove(movedRows, finalIndex, dropIndex, movePossible, orderChanged) {
            console.log(movedRows, finalIndex, dropIndex, movePossible, orderChanged);
        },
    });
});

watch(() => props.readOnly, value => hot.value && hot.value.updateSettings({
    readOnly: value
}));

function updateModelValue() {
    emits('update:modelValue', {
        data: data.value,
        columns: columns.value
    });
}

function updateColumnsWrap() {
    updateColumns(clone(columns.value, true) as Array<ColumnSettings> || [])
        .then(res => {
            // 更新
            columns.value = res;
            hot.value && hot.value.updateSettings({
                columns: columns.value as any
            });
            updateModelValue();
        })
}

</script>
<style scoped lang="less">
.handsontable-editor-wrap {
    .header {
        padding: 7px;
    }

    .content {
        position: absolute;
        top: 47px;
        left: 7px;
        right: 7px;
        bottom: 7px;
        overflow: auto;
    }
}
</style>
