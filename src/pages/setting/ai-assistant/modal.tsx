import {AiAssistant, buildAiAssistant} from "@/entity/ai/AiAssistant";
import {
  Form, FormInstance,
  FormItem,
  Input,
  Modal,
  Select,
  Slider,
  TabPane,
  Tabs,
  Textarea
} from "@arco-design/web-vue";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useAiServiceStore} from "@/store/ai/AiServiceStore";
import {SelectOptionGroup} from '@arco-design/web-vue'
import {isEmptyString} from "@/utils/lang/FieldUtil";

const RULES: FormInstance['rules'] = {
  'aiServiceId': [{
    required: true,
    message: '请选择 AI 服务',

  }],
  'name': [{
    required: true,
    message: '请输入助手名'
  }]
}

function buildForm(form: Ref<AiAssistant>) {
  const options: Array<SelectOptionGroup> = useAiServiceStore().aiServices.map(e => ({
    isGroup: true,
    label: e.name,
    options: e.models.map(m => ({
      label: m,
      value: `${e.id}|${m}`
    }))
  }))
  return () =>
    <Form model={form.value} layout={'vertical'} rules={RULES}>
      <Tabs defaultActiveKey={'base'}>
        <TabPane key={'base'} title={'提示词设置'}>
          <FormItem label={'助手名'} field={'name'} validateTrigger={['blur', 'change']}>
            <Input v-model={form.value.name} allowClear/>
          </FormItem>
          <FormItem label={'提示词'} field={'system'}>
            <Textarea v-model={form.value.system} maxLength={1000} autoSize={{minRows: 2, maxRows: 8}} showWordLimit/>
          </FormItem>
        </TabPane>
        <TabPane key={'model'} title={'模型设置'}>
          <FormItem label={'AI 服务'} field={'aiServiceId'} validateTrigger={['blur', 'change']}>
            <Select v-model={form.value.aiServiceId} options={options} allowSearch/>
          </FormItem>
          <FormItem field={'temperature'}>{{
            label: () => '模型温度',
            default: () => <Slider v-model={form.value.temperature} max={2} min={0} step={0.1}
                                   marks={{0: '0', 0.7: '0.7', 2: '2'}} style={{margin: '0', padding: '8px 4px'}}/>
          }}</FormItem>
          <FormItem field={'topP'}>{{
            label: () => 'Top-P',
            default: () => <Slider v-model={form.value.topP} max={1} min={0} step={0.01}
                                   marks={{0: '0', 1: '1'}} style={{margin: '0', padding: '8px 4px'}}/>
          }}</FormItem>
          <FormItem field={'maxChats'}>{{
            label: () => '上下文数',
            default: () => <Slider v-model={form.value.maxChats} max={20} min={0}
                                   marks={{0: '0', 5: '5', 10: '10', 15: '15', 20: '不限'}}
                                   style={{margin: '0', padding: '8px 4px'}}/>
          }}</FormItem>
        </TabPane>
      </Tabs>
    </Form>
}

export function addAiAssistant() {
  const form = ref(buildAiAssistant());
  Modal.open({
    title: '新增助手',
    draggable: true,
    content: buildForm(form),
    width: 500,
    async onBeforeOk() {
      if (isEmptyString(form.value.name)) {
        MessageUtil.warning("请输入助手名")
        return false;
      }
      if (isEmptyString(form.value.aiServiceId)) {
        MessageUtil.warning("请选择 AI 服务")
        return false;
      }
      try {
        await useAiAssistantStore().saveOrUpdate(form.value);
        MessageUtil.success("新增成功");
        return true;
      } catch (e) {
        MessageUtil.error("新增失败", e);
        return false;
      }
    }
  })
}