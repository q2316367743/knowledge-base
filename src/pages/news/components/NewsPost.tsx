import {
  Button,
  DialogPlugin,
  Form,
  FormItem,
  Input,
  InputGroup,
  Radio,
  RadioGroup, Switch,
  TabPanel,
  Tabs
} from "tdesign-vue-next";
import {NewsIndex, NewsContent, buildNewsContent, NewsTypeEnum} from "@/entity/news";
import {useNewsStore} from "@/store/db/NewsStore";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import MonacoEditor from "@/editor/MonacoEditor/MonacoEditor.vue";

export async function addNews(old?: NewsIndex) {
  let target: NewsContent;
  if (old) {
    const rule = await useNewsStore().getNewsRule(old.id);
    if (!rule) {
      return Promise.reject("资讯规则未找到");
    }
    target = {
      ...old,
      ...rule
    }
  } else {
    target = buildNewsContent();
  }
  const form = ref<NewsContent>(target);
  const action = old ? '修改' : '新增';
  const plugin = DialogPlugin({
    header: action + '插件',
    placement: 'center',
    draggable: true,
    width: 600,
    confirmBtn: {
      default: action
    },
    default: () => <Tabs defaultValue={'1'}>
      <TabPanel value={'1'} label={'基本设置'}>
        <Form data={form.value}>
          <FormItem label={'名称'} name={'name'} labelAlign={'top'}>
            <Input v-model={form.value.name} clearable={true}/>
          </FormItem>
          <FormItem label={'类型'} name={'type'} labelAlign={'top'}>
            <RadioGroup v-model={form.value.type}>
              <Radio value={NewsTypeEnum.RSS}>RSS</Radio>
              <Radio value={NewsTypeEnum.CUSTOMER}>自定义</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label={'图标'} name={'icon'} labelAlign={'top'}>
            <Input v-model={form.value.icon} clearable={true}/>
          </FormItem>
          <FormItem label={'链接'} name={'url'} labelAlign={'top'}>
            <InputGroup class={'w-full'}>
              <Input v-model={form.value.url} clearable={true}/>
              <Button theme={'primary'} disabled={isEmptyString(form.value.url)}>获取图标</Button>
            </InputGroup>
          </FormItem>
        </Form>
      </TabPanel>
      {form.value.type === NewsTypeEnum.CUSTOMER && <TabPanel value={'2'} label={'规则设置'}>
        <Form data={form.value}>
          <FormItem label={'列表规则'} name={'list'} labelAlign={'top'}>
            <Input v-model={form.value.list} clearable={true}/>
          </FormItem>
          <FormItem label={'标题规则'} name={'title'} labelAlign={'top'}>
            <Input v-model={form.value.title} clearable={true}/>
          </FormItem>
          <FormItem label={'作者规则'} name={'author'} labelAlign={'top'}>
            <Input v-model={form.value.author} clearable={true}/>
          </FormItem>
          <FormItem label={'描述规则'} name={'description'} labelAlign={'top'}>
            <Input v-model={form.value.description} clearable={true}/>
          </FormItem>
          <FormItem label={'图片规则'} name={'image'} labelAlign={'top'}>
            <Input v-model={form.value.image} clearable={true}/>
          </FormItem>
          <FormItem label={'链接规则'} name={'link'} labelAlign={'top'}>
            <Input v-model={form.value.link} clearable={true}/>
          </FormItem>
        </Form>
      </TabPanel>}
      <TabPanel value={'3'} label={'网络设置'}>
        <Form data={form.value}>
          <FormItem label={'是否使用webview'} name={'webview'} labelAlign={'top'}
                    help={'如果是客户端渲染，可以打开此开关'}>
            <Switch v-model={form.value.webview}/>
          </FormItem>
          <FormItem label={'等待时间|等待元素出现'} name={'wait'} labelAlign={'top'}>
            <Input v-model={form.value.wait} clearable={true} disabled={!form.value.webview}/>
          </FormItem>
        </Form>
      </TabPanel>
      <TabPanel value={'4'} label={'内容设置'}>
        <div class={'w-full h-250px mt-8'}>
          <MonacoEditor v-model={form.value.content} language={'javascript'} miniMap={false}/>
        </div>
      </TabPanel>
    </Tabs>,
    onConfirm: () => {
      useNewsStore().postNews(form.value)
        .then(() => {
          MessageUtil.success(action + "成功");
          plugin.destroy();
        })
        .catch((e) => {
          MessageUtil.error("修改失败", e);
        });
    }
  });
}