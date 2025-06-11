import {
  Button,
  DrawerPlugin,
  Form,
  FormItem,
  Input,
  List,
  ListItem,
  ListItemMeta,
  Radio,
  RadioGroup, Space
} from "tdesign-vue-next";
import {clone} from "radash";
import {AiService, AiServiceType, buildAiService} from "@/entity/ai/AiService";
import {useAiServiceStore} from "@/store";
import MessageUtil from "@/utils/modal/MessageUtil";
import {openAddModelDialog} from "@/pages/setting/ai-service/dialog/AddModel";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import {getAllModules} from "@/utils/component/AiModuleUtil";

export function openAddServiceDrawer(source?: AiService) {
  const op = !!source ? '修改' : '新增';
  const form = ref(source ? clone(source) : buildAiService());
  const loading = ref(false);

  const handleSave = () => {
    useAiServiceStore().saveOrUpdate(form.value)
      .then(() => {
        MessageUtil.success(op + "成功")
        dp.destroy?.();
      })
      .catch(e => MessageUtil.error(op + "失败", e));
  }
  const onAdd = () => openAddModelDialog().then(res => form.value.models.push(res))

  function fetchModules() {
    if (isEmptyString(form.value.url)) return MessageUtil.warning("请输入API 地址");
    if (isEmptyString(form.value.key)) return MessageUtil.warning("请输入API 密钥");
    (async () => {
      loading.value = true;
      try {
        form.value.models = await getAllModules(form.value);
        MessageUtil.success("获取成功");
      } catch (e) {
        MessageUtil.error("获取失败", e);
      } finally {
        loading.value = false;
      }
    })().catch(e => MessageUtil.error("获取失败", e));
  }

  const dp = DrawerPlugin({
    header: op + '服务',
    size: '800px',
    closeOnOverlayClick: false,
    closeOnEscKeydown: false,
    closeBtn: true,
    default: () => <Form data={form.value}>
      <FormItem label="服务名称" label-align="top">
        <Input allow-clear v-model={form.value.name}/>
      </FormItem>
      <FormItem label="服务类型" label-align="top">
        <RadioGroup v-model={form.value.type}>
          <Radio value={AiServiceType.OPENAI} label={'OpenAI'}>OpenAI</Radio>
          <Radio value={AiServiceType.OLLAMA} label={'Ollama'}>Ollama</Radio>
        </RadioGroup>
      </FormItem>
      <FormItem label="API 地址" label-align="top" help="注意，OpenAI的地址，结尾要加上/v1/">
        <Input allow-clear v-model={form.value.url}/>
      </FormItem>
      <FormItem label="API 密钥" label-align="top">
        <Input type="password" allow-clear v-model={form.value.key}/>
      </FormItem>
      <FormItem label="模型" label-align="top" help="上面填写完成后注意刷新模型">
        <List split={true} style="max-height: calc(100vh - 186px);" class="w-full">
          {form.value.models.map(e => <ListItem>{{
            default: () => <span>{e}</span>,
            action: () => <Button theme={'danger'}>删除</Button>
          }}</ListItem>)}
        </List>
      </FormItem>
    </Form>,
    footer: () => <div class={'flex justify-between items-center'}>
      <Button theme="primary" loading={loading.value} onClick={handleSave}>保存</Button>
      <Space>
        <Button theme="primary" loading={loading.value} onClick={fetchModules}>
          刷新
        </Button>
        <Button theme="default" loading={loading.value} onClick={onAdd}>
          添加
        </Button>
      </Space>
    </div>
  })
}