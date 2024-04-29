<template>
    <a-layout class="handsontable-editor-wrap abs-0">
        <div class="content">
            <div ref="containerRef" class="handsontable-editor"></div>
        </div>
        <div class="side">
            <a-button-group type="text" class="w-full">
                <div class="flex justify-between w-full">
                    <a-space>
                    </a-space>
                    <a-space direction="vertical">
                        <a-dropdown position="br">
                            <a-button>
                                <template #icon>
                                    <icon-settings/>
                                </template>
                            </a-button>
                            <template #content>
                                <a-doption @click="updateColumnsWrap()">修改列</a-doption>
                            </template>
                        </a-dropdown>
                        <a-tooltip content="导入" position="left">
                            <a-button @click="onImport()">
                                <template #icon>
                                    <icon-import/>
                                </template>
                            </a-button>
                        </a-tooltip>
                        <a-tooltip content="导出" position="left">
                            <a-button @click="onExport()">
                                <template #icon>
                                    <icon-export/>
                                </template>
                            </a-button>
                        </a-tooltip>
                        <a-tooltip content="支持的数学公式" position="left">
                            <a-button @click="openFormulaDrawer()">
                                <template #icon>
                                    <icon-formula />
                                </template>
                            </a-button>
                        </a-tooltip>
                    </a-space>
                </div>
            </a-button-group>
        </div>
    </a-layout>
</template>
<script lang="ts" setup>
import {onMounted, ref, shallowRef, watch} from "vue";
import {clone} from "xe-utils";
import Handsontable from 'handsontable';
import {HyperFormula} from "hyperformula";
import {registerLanguageDictionary, zhCN} from 'handsontable/i18n';
import {updateColumns} from "@/pages/home/layout/editor-content/editor/HandsontableEditor/drawer/columns";
import {useHandsontableImport} from "@/pages/home/layout/editor-content/editor/HandsontableEditor/hooks/ImportHook";
import MessageUtil from "@/utils/modal/MessageUtil";
import {
    handsontableExport,
    useHandsontableExport
} from "@/pages/home/layout/editor-content/editor/HandsontableEditor/hooks/ExportHook";
import {openFormulaDrawer} from "@/pages/home/layout/editor-content/editor/HandsontableEditor/drawer/FormulaDrawer";

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
const columns = ref<Array<Handsontable.ColumnSettings> | null>(props.modelValue ? (props.modelValue.columns ? (props.modelValue.columns.length === 0 ? null : props.modelValue.columns) : null) : null);
const columnSorting = ref<boolean | Handsontable.plugins.ColumnSorting.Config[]>(props.modelValue ? (props.modelValue.columnSorting || true) : true);

let onImport = () => {
    MessageUtil.warning("系统初始化中")
}

function onExport() {
    handsontableExport(data, columns as any);
}

// create an external HyperFormula instance
const hyperformulaInstance = HyperFormula.buildEmpty({
    // to use an external HyperFormula instance,
    // initialize it with the `'internal-use-in-handsontable'` license key
    licenseKey: 'internal-use-in-handsontable',
});


onMounted(() => {
    if (!containerRef.value) {
        return;
    }
    console.log(columnSorting.value)
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
        formulas: {
            engine: hyperformulaInstance,
        },

        // // enable filtering
        // filters: true,
        // // enable the column menu
        // dropdownMenu: true,

        columnSorting: typeof columnSorting.value === 'boolean' ? columnSorting.value : {
            initialConfig: columnSorting.value
        },

        afterChange(changes: Array<Handsontable.CellChange> | null, source: Handsontable.ChangeSource) {
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
        afterFilter(conditionsStack) {
            console.log(conditionsStack)
        },
        afterColumnSort(currentSortConfig, destinationSortConfigs) {
            columnSorting.value = destinationSortConfigs;
            // 保存
            updateModelValue();
        },
    });
    const useHandsontableImportResult = useHandsontableImport(props.articleId || 0, (records, columnsWrap) => {
        if (hot.value) {
            // 表格赋值
            hot.value.updateData(records);
            hot.value.updateSettings({columns: columnsWrap});
            // 数据赋值
            data.value = records;
            columns.value = columnsWrap;
            // 更新
            updateModelValue();
            MessageUtil.success("导入成功")
        }
    });
    useHandsontableExport(data, columns as any, props.articleId);
    onImport = () => {
        useHandsontableImportResult.onImport(props.articleId || 0);
    }

});

watch(() => props.readOnly, value => hot.value && hot.value.updateSettings({
    readOnly: value
}));

function updateModelValue() {
    emits('update:modelValue', {
        data: data.value,
        columns: columns.value,
        columnSorting: columnSorting.value
    });
}

function updateColumnsWrap() {
    updateColumns(clone(columns.value, true) as Array<Handsontable.ColumnSettings> || [])
        .then(res => {
            // 更新
            columns.value = res;
            hot.value && hot.value.updateSettings({
                columns: columns.value.length === 0 ? null : (columns.value as any)
            });
            updateModelValue();
        })
}



</script>
<style lang="less">
.handsontable-editor-wrap {

    .content {
        position: absolute;
        top: 7px;
        left: 7px;
        right: 46px;
        bottom: 7px;
        overflow: auto;
    }
    .side {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        padding: 7px;
    }
}

.handsontable-editor {
    color: var(--color-text-1);

    thead {
        th {
            color: var(--color-text-1);
            background-color: var(--color-neutral-2);
        }
    }

    tbody {
        th {
            color: var(--color-text-1);
            background-color: var(--color-neutral-2);
        }

        td, tr {
            color: var(--color-text-1);
            background-color: var(--color-bg-2);
        }
    }

    tbody th.ht__highlight, thead th.ht__highlight {
        color: var(--color-text-1);
        background-color: var(--color-neutral-3);
    }
}
.htMenu {
    .htCore {
        color: var(--color-text-1);
        background-color: var(--color-neutral-2);
    }
     table tbody tr td {
         background-color: var(--color-neutral-2);
         &.htDisabled {
             color: var(--color-text-4);
             &:hover {
                 background-color: var(--color-neutral-4);
             }
         }
         &.current {
             background-color: var(--color-neutral-3);
         }
     }
}
.handsontableInput {
    color: var(--color-text-1);
    background-color: var(--color-fill-2);
}
</style>
