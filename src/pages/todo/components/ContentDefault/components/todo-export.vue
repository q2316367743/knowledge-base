<template>
    <a-modal v-model:visible="visible" title="待办导出" draggable>
        <a-form :model="config" layout="vertical">
            <a-form-item label="时间范围">
                <a-range-picker v-model="config.rangeValue" :shortcuts="shortcuts"/>
            </a-form-item>
            <a-form-item label="文件类型">
                <a-radio-group type="button" v-model="config.type">
                    <a-radio :value="ExportFileTypeEnum.TEXT">纯文本</a-radio>
                    <a-radio :value="ExportFileTypeEnum.MARKDOWN">Markdown</a-radio>
                    <a-radio :value="ExportFileTypeEnum.HTML">网页</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="是否包含日期">
                <a-switch v-model="config.includeTime" type="round"/>
            </a-form-item>
            <a-form-item label="是否包含内容" v-if="config.type !== ExportFileTypeEnum.TEXT">
                <a-switch v-model="config.includeContent" type="round"/>
            </a-form-item>
        </a-form>
        <template #footer>
            <a-button @click="visible = false">取消</a-button>
            <a-button type="primary" @click="copyToClipboard()">复制到剪切板</a-button>
            <a-button type="primary" @click="exportTodo()">导出</a-button>
        </template>
    </a-modal>
</template>
<script lang="ts" setup>
import {ref, watch} from "vue";
import dayjs from "dayjs";
import {ShortcutType} from "@arco-design/web-vue";
import {useTodoStore} from "@/store/components/TodoStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {download} from "@/utils/BrowserUtil";
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import {htmlToMarkdown} from "@/utils/file/ConvertUtil";

enum ExportFileTypeEnum {
    TEXT = 1,
    MARKDOWN = 2,
    HTML = 3
}

const props = defineProps({
    visible: Boolean
});
const emits = defineEmits(['update:visible']);

const visible = ref(props.visible);

watch(() => props.visible, value => visible.value = value);
watch(() => visible.value, value => emits('update:visible', value));

const config = ref({
    rangeValue: [dayjs().add(-1, 'week').format("YYYY-MM-DD"),
        dayjs().format("YYYY-MM-DD")],
    type: ExportFileTypeEnum.TEXT,
    includeTime: false,
    includeContent: false
});

const shortcuts: ShortcutType[] = [
    {
        label: '上一周',
        value: () => [dayjs(), dayjs().add(-1, 'week')] as any[],
    },
    {
        label: '上个月',
        value: () => [dayjs(), dayjs().add(-1, 'month')],
    }
];

function exportTodo() {
    let ext = '';
    if (config.value.type === ExportFileTypeEnum.TEXT) {
        ext = 'txt';
    } else if (config.value.type === ExportFileTypeEnum.MARKDOWN) {
        ext = 'md';
    } else if (config.value.type === ExportFileTypeEnum.HTML) {
        ext = 'html';
    } else {
        MessageUtil.error("系统异常，导出类型未知");
        return;
    }
    exportTo().then(text => {
        const title = useTodoStore().title;
        download(text, `${title}.${ext}`, 'text/plain');
        visible.value = false;
    }).catch(e => MessageUtil.error("导出失败", e));
}

function copyToClipboard() {
    exportTo().then(text => {
        utools.copyText(text);
        visible.value = false;
        MessageUtil.success("已成功复制到剪切板");
    }).catch(e => MessageUtil.error("导出失败", e));
}


function exportTo(): Promise<string> {
    const start = dayjs(config.value.rangeValue[0]).valueOf();
    const end = dayjs(config.value.rangeValue[1]).valueOf();
    const items = useTodoStore().todoItems.filter(e => e.id >= start && e.id <= end)
            .sort((a, b) => a.id - b.id);
    if (items.length === 0) {
        return Promise.reject("所选时间范围之内没有待办");
    }

    if (config.value.type === ExportFileTypeEnum.TEXT) {
        return exportToText(items);
    } else if (config.value.type === ExportFileTypeEnum.MARKDOWN) {
        return exportToMarkdown(items);
    } else if (config.value.type === ExportFileTypeEnum.HTML) {
        return exportToHtml(items);
    } else {
        return Promise.reject("系统异常，导出类型未知")
    }

}

async function exportToText(items: Array<TodoItemIndex>): Promise<string> {
    const lines = new Array<string>()
    for (let item of items) {
        let line = item.title;
        if (config.value.includeTime) {
            line = dayjs(item.id).format("YYYY-MM-DD") + ' ' + item;
        }
        lines.push(line);
    }
    return Promise.resolve(lines.join("\n"));
}

async function exportToMarkdown(items: Array<TodoItemIndex>): Promise<string> {
    const lines = new Array<string>()
    for (let item of items) {
        // 标题
        lines.push(`# ${item.title}`, '');
        // 包含时间
        if (config.value.includeTime) {
            lines.push(`> ${dayjs(item.id).format("YYYY-MM-DD")}`, "");
        }
        // 包含内容
        if (config.value.includeContent) {
            // 获取内容
            let content = '';
            try {
                const todoItem = await useTodoStore().getTodoItem(item.id);
                content = todoItem.content.record.content;
            } catch (e) {
                MessageUtil.warning(`导出待办【${item.title}】时错误`, e)
                console.error("导出异常", e);
            }
            const markdown = htmlToMarkdown(content);
            lines.push(markdown, '')
        }
        lines.push('---', '')
    }
    return Promise.resolve(lines.join("\n"));
}

async function exportToHtml(items: Array<TodoItemIndex>): Promise<string> {
    const lines = new Array<string>();
    for (let item of items) {
        // 标题
        lines.push(`<h1>${item.title}</h1>`, '');
        // 包含时间
        if (config.value.includeTime) {
            lines.push(`<blockquote>${dayjs(item.id).format("YYYY-MM-DD")}</blockquote>`, "");
        }
        // 包含内容
        if (config.value.includeContent) {
            // 获取内容
            let content = '';
            try {
                const todoItem = await useTodoStore().getTodoItem(item.id);
                content = todoItem.content.record.content;
            } catch (e) {
                MessageUtil.warning(`导出待办【${item.title}】时错误`, e)
                console.error("导出异常", e);
            }
            lines.push(content, '')
        }
        lines.push('<br />', '')
    }
    return Promise.resolve(`
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8"/>
    <link rel="icon" type="image/png" href="/logo.png"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="referrer" content="never">
    <title>${useTodoStore().title}</title>
</head>
<body>
${lines.join("\n")}
</body>
</html>
    `);
}


</script>
<style scoped>

</style>
