import {
    Button,
    Form,
    FormItem,
    Modal,
    Radio,
    RadioGroup,
    RangePicker,
    ShortcutType,
    Switch
} from "@arco-design/web-vue";
import {ref} from "vue";
import dayjs from "dayjs";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useTodoStore} from "@/store/components/TodoStore";
import {download} from "@/utils/BrowserUtil";
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import {turndownService} from "@/plugin/sdk/Turndown";

enum ExportFileTypeEnum {
    TEXT = 1,
    MARKDOWN = 2,
    HTML = 3
}

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

export function openTodoExport() {

    const config = ref({
        rangeValue: [dayjs().add(-1, 'week').format("YYYY-MM-DD"),
            dayjs().format("YYYY-MM-DD")],
        type: ExportFileTypeEnum.TEXT,
        includeTime: false,
        includeContent: false
    });

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
            close();
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
                const markdown = turndownService.turndown(content);
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

    function copyToClipboard() {
        exportTo().then(text => {
            utools.copyText(text);
            MessageUtil.success("已成功复制到剪切板");
            close();
        }).catch(e => MessageUtil.error("导出失败", e));
    }

    function close() {
        modalReturn.close()
    }


    const modalReturn = Modal.open({
        title: '待办导出',
        content: () => <Form model={config.value} layout={'vertical'}>
            <FormItem label="时间范围">
                <RangePicker v-model={config.value.rangeValue} shortcuts={shortcuts}/>
            </FormItem>
            <FormItem label="文件类型">
                <RadioGroup type="button" v-model={config.value.type}>
                    <Radio value={ExportFileTypeEnum.TEXT}>纯文本</Radio>
                    <Radio value={ExportFileTypeEnum.MARKDOWN}>Markdown</Radio>
                    <Radio value={ExportFileTypeEnum.HTML}>网页</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="是否包含日期">
                <Switch v-model={config.value.includeTime} type="round"/>
            </FormItem>
            {config.value.type !== ExportFileTypeEnum.TEXT && <FormItem label="是否包含内容">
                <Switch v-model={config.value.includeContent} type="round"/>
            </FormItem>}
        </Form>,
        footer: () => <>
            <Button onClick={close}>取消</Button>
            <Button type="primary" onClick={copyToClipboard}>复制到剪切板</Button>
            <Button type="primary" onClick={exportTodo}>导出</Button>
        </>
    });
}
