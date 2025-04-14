<template>
  <t-layout class="handsontable-editor-wrap abs-0">
    <div class="content">
      <div ref="containerRef" class="handsontable-editor"></div>
    </div>
    <div class="side">
      <t-space direction="vertical" class="w-full">
        <div class="flex justify-between w-full">
          <t-space direction="vertical">
            <t-dropdown trigger="click" placement="bottom-right">
              <t-button shape="square">
                <template #icon>
                  <setting-icon/>
                </template>
              </t-button>
              <template #dropdown>
                <t-dropdown-item @click="updateColumnsWrap()">修改列</t-dropdown-item>
              </template>
            </t-dropdown>
            <t-tooltip content="导入" placement="left">
              <t-button shape="square" @click="onImport()">
                <template #icon>
                  <file-import-icon/>
                </template>
              </t-button>
            </t-tooltip>
            <t-tooltip content="导出" placement="left">
              <t-button shape="square" @click="onExport()">
                <template #icon>
                  <file-export-icon/>
                </template>
              </t-button>
            </t-tooltip>
            <t-tooltip content="支持的数学公式" placement="left">
              <t-button shape="square" @click="openFormulaDrawer()">
                <template #icon>
                  <code1-icon />
                </template>
              </t-button>
            </t-tooltip>
          </t-space>
        </div>
      </t-space>
    </div>
  </t-layout>
</template>
<script lang="ts" setup>
import Handsontable from 'handsontable';
import {HyperFormula} from "hyperformula";
import {registerLanguageDictionary, zhCN} from 'handsontable/i18n';
import {Code1Icon, FileExportIcon, FileImportIcon, SettingIcon} from "tdesign-icons-vue-next";
import {clone} from "@/utils/lang/ObjectUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {updateColumns} from "@/editor/HandsontableEditor/drawer/ColumnDrawer";
import {useHandsontableImport} from "@/editor/HandsontableEditor/hooks/ImportHook";
import {
  handsontableExport,
  useHandsontableExport
} from "@/editor/HandsontableEditor/hooks/ExportHook";
import {openFormulaDrawer} from "@/editor/HandsontableEditor/drawer/FormulaDrawer";
import {ColumnConditions} from "@/editor/HandsontableEditor/types";

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
const filters = ref<Array<ColumnConditions>>(props.modelValue ? (props.modelValue.filters || []) : [])
const mergeCells = ref<Handsontable.plugins.MergeCells.Settings>(props.modelValue ? (props.modelValue.mergeCells || true) : true);

let onImport = () => {
  MessageUtil.warning("系统初始化中")
}

function onExport() {
  handsontableExport(data, columns as any);
}

// create an external HyperFormula instance
const hyperFormulaInstance = HyperFormula.buildEmpty({
  // to use an external HyperFormula instance,
  // initialize it with the `'internal-use-in-handsontable'` license key
  licenseKey: 'internal-use-in-handsontable',
});

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
    formulas: {
      engine: hyperFormulaInstance,
    },

    // enable filtering
    filters: true,
    // enable the column menu
    dropdownMenu: true,

    columnSorting: typeof columnSorting.value === 'boolean' ? columnSorting.value : {
      initialConfig: columnSorting.value
    },

    mergeCells: mergeCells.value,

    // `afterInit()` is a Handsontable hook: it's fired after the Handsontable instance is initiated
    afterInit() {
      // @ts-ignore
      const instance = this as Handsontable;

      // get the `Filters` plugin, so you can use its API
      const filter = instance.getPlugin('filters');

      if (filter && filters.value.length > 0) {
        // filter data by the 'Price' column (column at index 2)
        // to display only items that are less than ('lt') $200
        for (let item of filters.value) {
          for (let condition of item.conditions) {
            if (condition.name) {
              filter.addCondition(item.column, condition.name, condition.args);
            }
          }
        }
        filter.filter();
      }

    },

    afterChange(changes: Array<Handsontable.CellChange> | null, source: Handsontable.ChangeSource) {
      console.debug(changes, source)
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
    afterFilter(conditionsStack: Array<ColumnConditions>) {
      filters.value = conditionsStack;
      updateModelValue();
    },
    afterColumnSort(currentSortConfig, destinationSortConfigs) {
      columnSorting.value = destinationSortConfigs;
      updateModelValue();
    },
    afterMergeCells(_cellRange, mergeParent, auto) {
      if (auto) {
        return;
      }
      let records: Array<any> = [];
      if (typeof mergeCells.value !== 'boolean') {
        records = mergeCells.value;
      }
      const idx = records.findIndex(e => {
        // @ts-ignore
        return e.row !== mergeParent.row && e.col !== mergeParent.col && e.rowspan !== mergeParent.rowspan && e.colspan !== mergeParent.colspan
      });
      if (idx === -1) {
        records.push(mergeParent);
        mergeCells.value = records;
        updateModelValue();
      }

    },
    afterUnmergeCells(cellRange: Handsontable.CellRange) {
      const row = cellRange.from.row;
      const col = cellRange.from.col;
      const rowspan = cellRange.to.row - row + 1;
      const colspan = cellRange.to.col - col + 1;
      if (typeof mergeCells.value !== 'boolean') {
        mergeCells.value = mergeCells.value.filter(e => {
          return e.row !== row ||
            e.col !== col ||
            e.rowspan !== rowspan ||
            e.colspan !== colspan
        });
        updateModelValue();
      }
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
    columnSorting: columnSorting.value,
    filters: filters.value,
    mergeCells: mergeCells.value
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
@import url('./index.less');
</style>
