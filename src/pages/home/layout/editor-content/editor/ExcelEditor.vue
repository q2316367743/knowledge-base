<template>
    <div id="excel-editor">表格</div>
</template>
<script lang="ts" setup>
import "@univerjs/design/lib/index.css";
import "@univerjs/ui/lib/index.css";
// import "@univerjs/docs-ui/lib/index.css";
import "@univerjs/sheets-ui/lib/index.css";
import "@univerjs/sheets-formula/lib/index.css";

import {IWorkbookData, Univer} from "@univerjs/core";
import { defaultTheme } from "@univerjs/design";
import { UniverDocsPlugin } from "@univerjs/docs";
import { UniverDocsUIPlugin } from "@univerjs/docs-ui";
import { UniverFormulaEnginePlugin } from "@univerjs/engine-formula";
import { UniverRenderEnginePlugin } from "@univerjs/engine-render";
import { UniverSheetsPlugin } from "@univerjs/sheets";
import { UniverSheetsFormulaPlugin } from "@univerjs/sheets-formula";
import { UniverSheetsUIPlugin } from "@univerjs/sheets-ui";
import { UniverUIPlugin } from "@univerjs/ui";
import {onMounted, PropType} from "vue";
import {content, getContent} from "@/store/components/HomeEditorStore";

const props = defineProps({
    modelValue: {
        type: Object as PropType<IWorkbookData>,
        default: {},
        required: false
    },
    readOnly: Boolean
});
const emits = defineEmits(['update:modelValue']);

onMounted(() => {

    const univer = new Univer({
        theme: defaultTheme,
    });

    // core plugins
    univer.registerPlugin(UniverRenderEnginePlugin);
    univer.registerPlugin(UniverFormulaEnginePlugin);
    univer.registerPlugin(UniverUIPlugin, {
        container: "excel-editor",
        header: true,
        toolbar: true,
        footer: true,
    });

    // doc plugins
    univer.registerPlugin(UniverDocsPlugin, {
        hasScroll: false,
    });
    univer.registerPlugin(UniverDocsUIPlugin);

    // sheet plugins
    univer.registerPlugin(UniverSheetsPlugin);
    univer.registerPlugin(UniverSheetsUIPlugin);
    univer.registerPlugin(UniverSheetsFormulaPlugin);


    const workbook = univer.createUniverSheet(props.modelValue);


    getContent.value = () => workbook.save();

});

</script>
<style>
#excel-editor {
    width: 100%;
    height: 100%;
}
</style>
