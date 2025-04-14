import {useUmami} from "@/plugin/umami";
import {
  Button, DateRangePicker, Descriptions, DescriptionsItem, DialogPlugin,
  Form,
  FormItem, Link,
  PresetRange,
  RadioButton,
  RadioGroup,
  Select,
  Switch, Textarea,
  SelectOption
} from "tdesign-vue-next";
import {
  Drawer,
} from "@arco-design/web-vue";
import dayjs from "dayjs";
import MessageUtil from "@/utils/modal/MessageUtil";
import {download} from "@/utils/BrowserUtil";
import {TodoItemIndex} from "@/entity/todo/TodoItem";
import {getItemByDefault, setItem} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {toDateTimeString} from "@/utils/lang/FormatUtil";
import {htmlToMarkdown} from "@/utils/file/ConvertUtil";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";

enum ExportFileTypeEnum {
  TEXT = 1,
  MARKDOWN = 2,
  HTML = 3,
  CUSTOMER = 4,
  AI = 5
}

interface Config {
  rangeValue: string[];
  type: ExportFileTypeEnum;
  includeTime: boolean;
  includeContent: boolean;
  script: string;
  aiAssistantId?: string;
  question?: string
}

const presets: PresetRange = {
  '上一周': () => [dayjs().toDate(), dayjs().add(-1, 'week').toDate()],
  '上个月': () => [dayjs().toDate(), dayjs().add(-1, 'month').toDate()],
};

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
    const {currentCategory} = useTodoWrapStore();
    const {name = '未知待办清单'} = currentCategory || {};
    download(text, `${name}.${ext}`, 'text/plain');
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
  useUmami.track("导出待办")
  const start = dayjs(config.rangeValue[0]).valueOf();
  const end = dayjs(config.rangeValue[1]).valueOf();
  const items: Array<TodoItemIndex> = useTodoWrapStore().todoGroupView
    .flatMap(e => e.children)
    .flatMap(e => e.children)
    .filter(e => e.id >= start && e.id <= end)
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
        const todoItem = await useTodoItemStore().getTodoItem(item.id);
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
        const todoItem = await useTodoItemStore().getTodoItem(item.id);
        content = todoItem.content.record.content;
      } catch (e) {
        MessageUtil.warning(`导出待办【${item.title}】时错误`, e)
        console.error("导出异常", e);
      }
      lines.push(content, '')
    }
    lines.push('<br />', '')
  }
  const {currentCategory} = useTodoWrapStore();
  const {name = '未知待办清单'} = currentCategory || {};
  return Promise.resolve(`
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8"/>
    <link rel="icon" type="image/png" href="/logo.png"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="referrer" content="never">
    <title>${name}</title>
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
    const todoItem = await useTodoItemStore().getTodoItem(item.id);
    lines.push(run(todoItem, {
      toDateString: toDateTimeString
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
        <DescriptionsItem label={'标签'}>item.content.record.tags: Array string</DescriptionsItem>
        <DescriptionsItem label={'内容（html）'}>item.content.record.content: string</DescriptionsItem>
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
    script: getItemByDefault(LocalNameEnum.KEY_TODO_SCRIPT, ""),
  });
  const options = computed<Array<SelectOption>>(() => {
    const {aiAssistants} = useAiAssistantStore();
    return aiAssistants.map(e => ({
      label: e.name,
      value: e.id
    }))
  });

  watch(() => config.value.script, value => setItem(LocalNameEnum.KEY_TODO_SCRIPT, value));


  function close() {
    modalReturn.destroy()
  }


  const modalReturn = DialogPlugin({
    header: '待办导出',
    placement: 'center',
    default: () => <Form data={config.value} class={'pl-4px pr-4px'}>
      <FormItem label="时间范围" labelAlign={'top'}>
        <DateRangePicker v-model={config.value.rangeValue} clearable={true} presets={presets}/>
      </FormItem>
      <FormItem label="文件类型" labelAlign={'top'}>
        <RadioGroup v-model={config.value.type} variant="default-filled">
          <RadioButton value={ExportFileTypeEnum.TEXT}>纯文本</RadioButton>
          <RadioButton value={ExportFileTypeEnum.MARKDOWN}>Markdown</RadioButton>
          <RadioButton value={ExportFileTypeEnum.HTML}>网页</RadioButton>
          <RadioButton value={ExportFileTypeEnum.CUSTOMER}>自定义</RadioButton>
          <RadioButton value={ExportFileTypeEnum.AI}>AI总结</RadioButton>
        </RadioGroup>
      </FormItem>
      {config.value.type !== ExportFileTypeEnum.CUSTOMER && <FormItem label="是否包含日期" labelAlign={'top'}>
        <Switch v-model={config.value.includeTime}/>
      </FormItem>}
      {(config.value.type !== ExportFileTypeEnum.TEXT && config.value.type !== ExportFileTypeEnum.CUSTOMER) &&
        <FormItem label="是否包含内容" labelAlign={'top'}>
          <Switch v-model={config.value.includeContent}/>
        </FormItem>}
      {config.value.type === ExportFileTypeEnum.CUSTOMER && <FormItem label={"自定义脚本"} labelAlign={'top'}>
        {{
          default: () => <Textarea v-model={config.value.script} autosize={{minRows: 3, maxRows: 8}}
                                   placeholder={'return `title:${item.index.title}`'}/>,
          help: () => <div><Link onClick={openArgs}>点此</Link>查看变量</div>
        }}
      </FormItem>}
      {config.value.type === ExportFileTypeEnum.AI && <>
        <FormItem label={'AI 助手'} labelAlign={'top'}>
          <Select v-model={config.value.aiAssistantId} placeholder={'请选择 AI 助手'} options={options.value}/>
        </FormItem>
        <FormItem label={'AI 助手问题'} labelAlign={'top'}>
          <Textarea v-model={config.value.question} autosize={{minRows: 3, maxRows: 8}}
                    placeholder={'比如：请帮我写一篇周报'}/>
        </FormItem>
      </>}
    </Form>,
    footer: () => <>
      <Button theme={'default'} onClick={close}>取消</Button>
      <Button theme="primary" onClick={() => copyToClipboard(config.value, close)}>复制到剪切板</Button>
      <Button theme="primary" onClick={() => exportTodo(config.value, close)}>导出</Button>
    </>
  });
}

