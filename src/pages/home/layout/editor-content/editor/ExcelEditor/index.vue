<template>
    <div :id="editorId" class="excel-editor">表格</div>
</template>
<script lang="ts" setup>
import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula/lib/index.css";

import {IWorkbookData, Univer} from "@univerjs/core";
import {defaultTheme} from "@univerjs/design";
import {UniverDocsPlugin} from "@univerjs/docs";
import {UniverFormulaEnginePlugin} from "@univerjs/engine-formula";
import {UniverRenderEnginePlugin} from "@univerjs/engine-render";
import {UniverSheetsPlugin} from "@univerjs/sheets";
import {UniverSheetsFormulaPlugin} from "@univerjs/sheets-formula";
import {UniverSheetsUIPlugin} from "@univerjs/sheets-ui";
import {UniverUIPlugin} from "@univerjs/ui";
import {onMounted, onBeforeUnmount, PropType, ref, toRaw} from "vue";
import {useArticleExportEvent, useSaveContentEvent} from "@/store/components/HomeEditorStore";
import type {Workbook} from "@univerjs/core/lib/types/sheets/workbook";

import './darkTheme.less';
import MessageUtil from "@/utils/MessageUtil";
import {useIntervalFn} from "@vueuse/core";

const props = defineProps({
    modelValue: {
        type: Object as PropType<IWorkbookData>,
        default: {},
        required: false
    },
    readOnly: Boolean,
    articleId: Number
});
const emits = defineEmits(['update:modelValue']);


const now = new Date().getTime();
const editorId = ref('excel-editor-' + now);


const univer = new Univer({
    theme: defaultTheme,
});

let workbook: Workbook;

onMounted(() => {

    // core plugins
    univer.registerPlugin(UniverRenderEnginePlugin);
    univer.registerPlugin(UniverFormulaEnginePlugin);
    univer.registerPlugin(UniverUIPlugin, {
        container: editorId.value,
        header: true,
        toolbar: true,
        footer: true,
    });

    // doc plugins
    univer.registerPlugin(UniverDocsPlugin, {
        hasScroll: false,
    });

    // sheet plugins
    univer.registerPlugin(UniverSheetsPlugin);
    univer.registerPlugin(UniverSheetsUIPlugin);
    univer.registerPlugin(UniverSheetsFormulaPlugin);

    workbook = univer.createUniverSheet(toRaw(props.modelValue));
    useArticleExportEvent.off(onExport);
    useArticleExportEvent.on(onExport);
    useSaveContentEvent.off(onSave);
    useSaveContentEvent.on(onSave);

});

onBeforeUnmount(() => {
    univer.dispose();
    useSaveContentEvent.off(onSave);
    useArticleExportEvent.off(onExport);
});


function onSave(id: number) {
    if (props.readOnly) {
        // 只读不保存
        MessageUtil.warning("预览模式，无法保存");
        return;
    }
    if (workbook && props.articleId === id) {
        emits("update:modelValue", workbook.save());
    }
}

useIntervalFn(() => {
    if (props.readOnly) {
        // 只读不保存
        return;
    }
    onSave(props.articleId || 0);
}, 5000)

function onExport(id: number) {
    if (props.articleId === id) {
        MessageUtil.warning("导出功能正在开发中...")
    }
}


</script>
<style>
.excel-editor {
    width: 100%;
    height: 100%;
}
</style>
