import {
    Button, Descriptions, DescriptionsItem, Drawer,
    Form,
    FormItem, Link,
    Modal,
    Radio,
    RadioGroup,
    RangePicker,
    ShortcutType,
    Switch, Textarea
} from "@arco-design/web-vue";
import {ref, watch} from "vue";
import dayjs from "dayjs";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useTodoStore} from "@/store/components/TodoStore";
import {download} from "@/utils/BrowserUtil";
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import {turndownService} from "@/plugin/sdk/Turndown";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {toDateString} from "@/utils/lang/FormatUtil";

enum ExportFileTypeEnum {
    TEXT = 1,
    MARKDOWN = 2,
    HTML = 3,
    CUSTOMER = 4
}

interface Config {
    rangeValue: string[];
    type: ExportFileTypeEnum;
    includeTime: boolean;
    includeContent: boolean;
    script: string;
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

function exportTodo(config: Config, close: () => void) {
    let ext = '';
    if (config.type === ExportFileTypeEnum.TEXT) {
        ext = 'txt';
    } else if (config.type === ExportFileTypeEnum.MARKDOWN) {
        ext = 'md';
    } else if (config.type === ExportFileTypeEnum.HTML) {
        ext = 'html';
    } else if (config.type === ExportFileTypeEnum.CUSTOMER) {
        ext = 'txt';
    } else {
        MessageUtil.error("系统异常，导出类型未知");
        return;
    }
    exportTo(config).then(text => {
        const title = useTodoStore().title;
        download(text, `${title}.${ext}`, 'text/plain');
        close();
    }).catch(e => MessageUtil.error("导出失败", e));
}

function copyToClipboard(config: Config, close: () => void) {
    exportTo(config).then(text => {
        utools.copyText(text);
        MessageUtil.success("已成功复制到剪切板");
        close();
    }).catch(e => MessageUtil.error("导出失败", e));
}

function exportTo(config: Config): Promise<string> {
    const start = dayjs(config.rangeValue[0]).valueOf();
    const end = dayjs(config.rangeValue[1]).valueOf();
    const items = useTodoStore().todoItems.filter(e => e.id >= start && e.id <= end)
        .sort((a, b) => a.id - b.id);
    if (items.length === 0) {
        return Promise.reject("所选时间范围之内没有待办");
    }

    if (config.type === ExportFileTypeEnum.TEXT) {
        return exportToText(items, config);
    } else if (config.type === ExportFileTypeEnum.MARKDOWN) {
        return exportToMarkdown(items, config);
    } else if (config.type === ExportFileTypeEnum.HTML) {
        return exportToHtml(items, config);
    } else if (config.type === ExportFileTypeEnum.CUSTOMER) {
        return exportToCustomer(items, config);
    } else {
        return Promise.reject("系统异常，导出类型未知")
    }

}


async function exportToText(items: Array<TodoItemIndex>, config: Config): Promise<string> {
    const lines = new Array<string>()
    for (let item of items) {
        let line = item.title;
        if (config.includeTime) {
            line = dayjs(item.id).format("YYYY-MM-DD") + ' ' + item;
        }
        lines.push(line);
    }
    return Promise.resolve(lines.join("\n"));
}

async function exportToMarkdown(items: Array<TodoItemIndex>, config: Config): Promise<string> {
    const lines = new Array<string>()
    for (let item of items) {
        // 标题
        lines.push(`# ${item.title}`, '');
        // 包含时间
        if (config.includeTime) {
            lines.push(`> ${dayjs(item.id).format("YYYY-MM-DD")}`, "");
        }
        // 包含内容
        if (config.includeContent) {
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

async function exportToHtml(items: Array<TodoItemIndex>, config: Config): Promise<string> {
    const lines = new Array<string>();
    for (let item of items) {
        // 标题
        lines.push(`<h1>${item.title}</h1>`, '');
        // 包含时间
        if (config.includeTime) {
            lines.push(`<blockquote>${dayjs(item.id).format("YYYY-MM-DD")}</blockquote>`, "");
        }
        // 包含内容
        if (config.includeContent) {
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

async function exportToCustomer(items: Array<TodoItemIndex>, config: Config): Promise<string> {
    const lines = new Array<string>();
    const run = new Function('item', 'func', config.script)
    for (let item of items) {
        const todoItem = await useTodoStore().getTodoItem(item.id);
        lines.push(run(todoItem, {
            toDateString: toDateString
        }))
    }
    return Promise.resolve(lines.join("\n"));
}


function openArgs() {
    Drawer.open({
        title: "可用变量",
        width: 500,
        content: () => <>
            <Descriptions column={1} title={'变量'}>
                <DescriptionsItem label={'标题'}>item.index.title: string</DescriptionsItem>
                <DescriptionsItem label={'创建时间'}>item.index.createTime: string</DescriptionsItem>
                <DescriptionsItem label={'是否置顶'}>item.index.top: boolean</DescriptionsItem>
                <DescriptionsItem label={'状态'}>item.index.status: 1待办，2已完成，3放弃</DescriptionsItem>
                <DescriptionsItem label={'优先级'}>item.index.priority: 1高，2中，3低，4无</DescriptionsItem>
                <DescriptionsItem label={'开始时间'}>item.attr.start: string</DescriptionsItem>
                <DescriptionsItem label={'结束时间'}>item.attr.end: string</DescriptionsItem>
                <DescriptionsItem label={'标签'}>item.content.tags: Array string</DescriptionsItem>
                <DescriptionsItem label={'内容（html）'}>item.content.content: string</DescriptionsItem>
            </Descriptions>
            <Descriptions column={1} title={'方法'}>
                <DescriptionsItem label={'格式化时间'}>
                    func.toDateString(date: Date|string|number, format?:string) //格式化类似于yyyy-MM-dd HH:mm:ss
                </DescriptionsItem>
            </Descriptions>
        </>,
        footer: false
    })
}

export function openTodoExport() {

    const config = ref<Config>({
        rangeValue: [dayjs().add(-1, 'week').format("YYYY-MM-DD"),
            dayjs().format("YYYY-MM-DD")],
        type: ExportFileTypeEnum.TEXT,
        includeTime: false,
        includeContent: false,
        script: getItemByDefault(LocalNameEnum.KEY_TODO_SCRIPT, "")
    });

    watch(() => config.value.script, value => setItem(LocalNameEnum.KEY_TODO_SCRIPT, value));


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
                    <Radio value={ExportFileTypeEnum.CUSTOMER}>自定义</Radio>
                </RadioGroup>
            </FormItem>
            {config.value.type !== ExportFileTypeEnum.CUSTOMER && <FormItem label="是否包含日期">
                <Switch v-model={config.value.includeTime} type="round"/>
            </FormItem>}
            {(config.value.type !== ExportFileTypeEnum.TEXT && config.value.type !== ExportFileTypeEnum.CUSTOMER) &&
                <FormItem label="是否包含内容">
                    <Switch v-model={config.value.includeContent} type="round"/>
                </FormItem>}
            {config.value.type === ExportFileTypeEnum.CUSTOMER && <FormItem label={"自定义脚本"}>
                {{
                    default: () => <Textarea v-model={config.value.script} autoSize={{minRows: 3, maxRows: 8}}
                                             allowClear placeholder={'return `title:${item.index.title}`'}/>,
                    help: () => <div><Link onClick={openArgs}>点此</Link>查看变量</div>
                }}
            </FormItem>}
        </Form>,
        footer: () => <>
            <Button onClick={close}>取消</Button>
            <Button type="primary" onClick={() => copyToClipboard(config.value, close)}>复制到剪切板</Button>
            <Button type="primary" onClick={() => exportTodo(config.value, close)}>导出</Button>
        </>
    });
}

