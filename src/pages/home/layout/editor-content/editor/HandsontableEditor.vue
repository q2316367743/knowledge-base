<template>
    <a-layout class="handsontable-editor-wrap abs-0">
        <div ref="containerRef"></div>
    </a-layout>
</template>
<script lang="ts" setup>
import {onMounted, ref, shallowRef} from "vue";
import Handsontable from 'handsontable';
import {registerLanguageDictionary, zhCN} from 'handsontable/i18n';
import {CellChange, ChangeSource} from "handsontable/common";

registerLanguageDictionary(zhCN)

const props = defineProps({
    modelValue: Object,
    readOnly: Boolean,
    articleId: Number
});
const emits = defineEmits(['update:modelValue']);

const containerRef = ref<HTMLElement>();
const hot = shallowRef<Handsontable | null>(null);
const data = ref<Array<Array<string>>>(props.modelValue ? props.modelValue.data : [["", "", "", "", "", ""]]);

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
        manualRowResize: true,
        licenseKey: 'non-commercial-and-evaluation', // for non-commercial use only
        afterChange(changes: Array<CellChange> | null, source: ChangeSource) {
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
            emits('update:modelValue', {
                data: data.value
            });
        },
        readOnly: props.readOnly,
        language: zhCN.languageCode,
    });
});


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
    }
}
</style>
