import {Form, FormItem, Input, Modal, Space, Textarea, Tooltip} from "@arco-design/web-vue";
import {codeRunSetting} from "@/plugin/CodeRun";
import {IconQuestionCircle} from "@arco-design/web-vue/es/icon";
import MessageUtil from "@/utils/modal/MessageUtil";

export function addCodeRunCommand() {
  const model = ref({
    key: '',
    value: ''
  });
  const validateStatus = computed<'error' | undefined>(() => {
    const {key} = model.value;
    if (codeRunSetting.value[key]) {
      return 'error'
    }
    return undefined
  });
  const help = '{{filePath}}为文件的实际路径，例如执行js文件：node {{filePath}}'
  Modal.open({
    title: '添加代码运行命令',
    width: 600,
    content: () => <Form model={model.value} layout={'vertical'}>
      <FormItem validateStatus={validateStatus.value}>{{
        label: () => <Space>
          <div>文件名匹配规则</div>
          <Tooltip content={'支持正则表达式，符合正则表达式的代码文件会使用该命令'}>
            <IconQuestionCircle/>
          </Tooltip>
        </Space>,
        default: () => <Input v-model={model.value.key} placeholder={'请输入文件名匹配规则'}/>,
        help: () => <span>{validateStatus.value === 'error' ? '该规则已存在' : ''}</span>
      }}</FormItem>
      <FormItem label="命令内容">{{
        default: () => <Textarea v-model={model.value.value} placeholder={'请输入命令内容'} maxLength={255} allowClear showWordLimit/>,
        help: () => <span>{help}</span>
      }}</FormItem>
    </Form>,
    okText: '添加',
    onBeforeOk() {
      if (model.value.key.trim() === '') {
        MessageUtil.warning("请输入文件名匹配规则");
        return false;
      }
      if (model.value.value.trim() === '') {
        MessageUtil.warning("请输入命令内容");
        return false;
      }
      codeRunSetting.value[model.value.key] = model.value.value;
      return true
    }
  })
}


export function updateCodeRunCommand(key: string, value: string) {
  const model = ref({
    value: value
  });
  const help = '{{filePath}}为文件的实际路径，例如执行js文件：node {{filePath}}'
  Modal.open({
    title: '修改代码运行命令',
    width: 600,
    content: () => <Form model={model.value} layout={'vertical'}>
      <FormItem label="命令内容">{{
        default: () => <Textarea v-model={model.value.value} placeholder={'请输入命令内容'} maxLength={255} allowClear showWordLimit />,
        help: () => <span>{help}</span>
      }}</FormItem>
    </Form>,
    okText: '修改',
    onBeforeOk() {
      if (model.value.value.trim() === '') {
        MessageUtil.warning("请输入命令内容");
        return false;
      }
      codeRunSetting.value[key] = model.value.value;
      return true
    }
  })
}

export function deleteCodeRunCommand(key: string) {
  Modal.confirm({
    title: '删除代码运行命令',
    content: '确定要删除该代码运行命令吗？',
    onOk() {
      delete codeRunSetting.value[key];
    }
  })
}