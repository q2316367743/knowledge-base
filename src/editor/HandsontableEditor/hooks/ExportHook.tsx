import {onUnmounted, Ref} from "vue";
import Handsontable from "handsontable";
import {Alert, Button, ButtonGroup, Drawer, Link, Space} from "@arco-design/web-vue";
import {useArticleExportEvent} from "@/store/components/HomeEditorStore";
import {copy} from "@/utils/BrowserUtil";

export function createDataByColumns(data: Array<Array<string>>, columns: Array<Handsontable.ColumnSettings> | null): string {
    if (!columns) {
        return "";
    }
    const records = new Array<Record<string, string>>();
    for (let valueElement of data) {
        const record: Record<string, string> = {};
        columns?.forEach((column, i) => {
            record[column.title || `column_${i + 1}`] = valueElement[i];
        });
        records.push(record);
    }
    return JSON.stringify(records);
}

export function createDataNotColumns(data: Array<Array<string>>): string {
    const records = new Array<Record<string, string>>();
    for (let valueElement of data) {
        const record: Record<string, string> = {};
        valueElement.forEach((str, i) => {
            record[`column_${i + 1}`] = str;
        })
    }
    return JSON.stringify(records);
}


export function handsontableExport(data: Ref<Array<Array<string>>>, columns: Ref<Array<Handsontable.ColumnSettings> | null>) {

    function conversionAndPaste() {
        utools.redirect(['Json & Excel', '转换成Excel'], {
            type: 'text',
            data: columns.value ? createDataByColumns(data.value, columns.value) : createDataNotColumns(data.value)
        })
    }

    function onPaste() {
        copy(columns.value ? createDataByColumns(data.value, columns.value) : createDataNotColumns(data.value));
    }

    Drawer.open({
        title: '导出',
        footer: false,
        width: 530,
        content: () => <Space direction="vertical">
            <Alert>此功能需要插件【<Link>Json & Excel</Link>】，将Json内容转为Excel。</Alert>
            <Alert>仅支持单个sheet，请不要一次性传入多个sheet；传入多个sheet，只会导入第一个sheet。</Alert>
            <ButtonGroup type={'primary'}>
                <Button onClick={onPaste}>复制数据</Button>
                <Button onClick={conversionAndPaste}>复制数据并打开插件</Button>
            </ButtonGroup>
        </Space>,
    })
}

export function useHandsontableExport(
    data: Ref<Array<Array<string>>>,
    columns: Ref<Array<Handsontable.ColumnSettings> | null>,
    articleId?: number) {

    function onExport(id: number) {
        if (id === articleId) {
            handsontableExport(data, columns);
        }
    }

    useArticleExportEvent.off(onExport);
    useArticleExportEvent.on(onExport);

    onUnmounted(() => {
        useArticleExportEvent.off(onExport);
    })
}
