import {AiAssistant, buildAiAssistant} from "@/entity/ai/AiAssistant";
import {
  Form, FormInstance,
  FormItem,
  Input,
  Modal,
  Select,
  Slider, Space,
  TabPane,
  Tabs,
  Textarea
} from "@arco-design/web-vue";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useAiServiceStore} from "@/store/ai/AiServiceStore";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import {clone} from "radash";

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
  const options = computed(() => useAiServiceStore().aiServices.map(e => ({
    label: e.name,
    value: e.id,
    options: e.models.map(m => ({
      label: m,
      value: m
    }))
  })));
  const models = computed(() => {
    for (let option of options.value) {
      if (option.value === form.value.aiServiceId) {
        return option.options;
      }
    }
    return [];
  })
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
            <Space>
              <Select v-model={form.value.aiServiceId} options={options.value} allowSearch/>
              <Select v-model={form.value.model} options={models.value} allowSearch/>
            </Space>
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


export function editAiAssistant(old: AiAssistant) {
  const form = ref(clone(old));
  Modal.open({
    title: '修改助手',
    draggable: true,
    content: buildForm(form),
    width: 500,
    async onBeforeOk() {
      try {
        await useAiAssistantStore().saveOrUpdate(form.value);
        MessageUtil.success("修改成功");
        return true;
      } catch (e) {
        MessageUtil.error("修改失败", e);
        return false;
      }
    }
  })
}