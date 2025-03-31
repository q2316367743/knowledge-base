import {AiAssistant, buildAiAssistant} from "@/entity/ai/AiAssistant";
import {
  Form,
  FormItem, FormRules,
  Input,
  DialogPlugin,
  Select,
  Slider, Space,
  TabPanel,
  Tabs,
  Textarea
} from "tdesign-vue-next";
import {useAiAssistantStore} from "@/store/ai/AiAssistantStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {useAiServiceStore} from "@/store";
import {clone} from "radash";
import {AiServiceType} from "@/entity/ai/AiService";

const RULES: FormRules = {
  'aiServiceId': [{
    required: true,
    message: '请选择 AI 服务',
    trigger: 'blur'

  }],
  'name': [{
    required: true,
    message: '请输入助手名',
    trigger: 'blur'
  }]
}

function buildForm(form: Ref<AiAssistant>) {
  const options = computed(() => useAiServiceStore().aiServices.map(e => ({
    label: e.name,
    value: e.id,
    options: e.models.map(m => (typeof m === 'string' ? {
      label: m,
      value: m
    } : {
      label: m.name,
      value: m.id
    }))
  })));
  const models = computed(() => {
    for (let option of options.value) {
      if (option.value === form.value.aiServiceId) {
        return option.options;
      }
    }
    return [];
  });
  const disabled = computed(() => {
    const {aiServices} = useAiServiceStore();
    for (let service of aiServices) {
      if (service.id === form.value.aiServiceId) {
        return service.type === AiServiceType.U_TOOLS;
      }
    }
    return false;
  })
  return () => <Form data={form.value} layout={'vertical'} rules={RULES}>
    <Tabs defaultValue={'base'}>
      <TabPanel value={'base'} label={'提示词设置'} style={{marginTop: '8px'}}>
        <FormItem label={'助手名'} name={'name'}>
          <Input v-model={form.value.name} clearable/>
        </FormItem>
        <FormItem label={'提示词'} name={'system'}>
          <Textarea v-model={form.value.system} maxcharacter={1000} autosize={{minRows: 2, maxRows: 8}}/>
        </FormItem>
      </TabPanel>
      <TabPanel value={'model'} label={'模型设置'} style={{padding: '8px 16px 16px'}}>
        <FormItem label={'AI 服务'} name={'aiServiceId'}>
          <Space>
            <Select v-model={form.value.aiServiceId} options={options.value}/>
            <Select v-model={form.value.model} options={models.value}/>
          </Space>
        </FormItem>
        <FormItem name={'temperature'}>{{
          label: () => '模型温度',
          default: () => <Slider v-model={form.value.temperature} max={2} min={0} step={0.1} disabled={disabled.value}
                                 marks={{0: '0', 0.7: '0.7', 2: '2'}} style={{margin: '0', padding: '8px 4px'}}/>
        }}</FormItem>
        <FormItem name={'topP'}>{{
          label: () => 'Top-P',
          default: () => <Slider v-model={form.value.topP} max={1} min={0} step={0.01} disabled={disabled.value}
                                 marks={{0: '0', 1: '1'}} style={{margin: '0', padding: '8px 4px'}}/>
        }}</FormItem>
        <FormItem name={'maxChats'}>{{
          label: () => '上下文数',
          default: () => <Slider v-model={form.value.maxChats} max={20} min={0} disabled={disabled.value}
                                 marks={{0: '0', 5: '5', 10: '10', 15: '15', 20: '不限'}}
                                 style={{margin: '0', padding: '8px 4px'}}/>
        }}</FormItem>
      </TabPanel>
    </Tabs>
  </Form>
}

export function addAiAssistant() {
  const form = ref(buildAiAssistant());
  const plugin = DialogPlugin({
    header: '新增助手',
    placement: 'center',
    draggable: true,
    default: buildForm(form),
    width: '600px',
    async onConfirm() {
      try {
        await useAiAssistantStore().saveOrUpdate(form.value);
        MessageUtil.success("新增成功");
        plugin.destroy();
        return true;
      } catch (e) {
        MessageUtil.error("新增失败", e);
        return false;
      }
    }
  });
}


export function editAiAssistant(old: AiAssistant) {
  const form = ref(clone(old));
  const plugin = DialogPlugin({
    header: '修改助手',
    placement: 'center',
    draggable: true,
    default: buildForm(form),
    width: '600px',
    confirmBtn: {
      default: '保存'
    },
    async onConfirm() {
      try {
        await useAiAssistantStore().saveOrUpdate(form.value);
        MessageUtil.success("修改成功");
        plugin.destroy();
        return true;
      } catch (e) {
        MessageUtil.error("修改失败", e);
        return false;
      }
    }
  })
}