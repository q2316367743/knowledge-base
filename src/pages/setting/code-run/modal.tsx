import {DialogPlugin, Form, FormItem, Input, Space, Textarea, Tooltip} from "tdesign-vue-next";
import {QuestionnaireIcon} from "tdesign-icons-vue-next";
import {codeRunSetting} from "@/plugin/CodeRun";
import MessageUtil from "@/utils/modal/MessageUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";

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
  const dp = DialogPlugin({
    header: '添加代码运行命令',
    width: 600,
    placement: "center",
    default: () => <Form data={model.value}>
      <FormItem status={validateStatus.value} labelAlign={'top'}>{{
        label: () => <Space>
          <div>文件名匹配规则</div>
          <Tooltip content={'支持正则表达式，符合正则表达式的代码文件会使用该命令'}>
            <QuestionnaireIcon/>
          </Tooltip>
        </Space>,
        default: () => <Input v-model={model.value.key} placeholder={'请输入文件名匹配规则'}/>,
        help: () => <span>{validateStatus.value === 'error' ? '该规则已存在' : ''}</span>
      }}</FormItem>
      <FormItem label="命令内容" labelAlign={'top'}>{{
        default: () => <Textarea v-model={model.value.value} placeholder={'请输入命令内容'} maxlength={255}/>,
        help: () => <span>{help}</span>
      }}</FormItem>
    </Form>,
    confirmBtn: '添加',
    onConfirm() {
      if (model.value.key.trim() === '') {
        MessageUtil.warning("请输入文件名匹配规则");
        return;
      }
      if (model.value.value.trim() === '') {
        MessageUtil.warning("请输入命令内容");
        return;
      }
      codeRunSetting.value[model.value.key] = model.value.value;
      dp.destroy();
    }
  })
}


export function updateCodeRunCommand(key: string, value: string) {
  const model = ref({
    value: value
  });
  const help = '{{filePath}}为文件的实际路径，例如执行js文件：node {{filePath}}'
  const dp = DialogPlugin({
    header: '修改代码运行命令',
    placement: "center",
    width: 600,
    default: () => <Form data={model.value}>
      <FormItem label="命令内容" labelAlign={'top'}>{{
        default: () => <Textarea v-model={model.value.value} placeholder={'请输入命令内容'} maxlength={255}/>,
        help: () => <span>{help}</span>
      }}</FormItem>
    </Form>,
    confirmBtn: '修改',
    onBeforeOk() {
      if (model.value.value.trim() === '') {
        MessageUtil.warning("请输入命令内容");
        return;
      }
      codeRunSetting.value[key] = model.value.value;
      dp.destroy();
    }
  })
}

export function deleteCodeRunCommand(key: string) {
  MessageBoxUtil.confirm('确定要删除该代码运行命令吗？', '删除代码运行命令')
    .then(() => {
      delete codeRunSetting.value[key];
    })
}