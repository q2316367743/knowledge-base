import {
  Button,
  DialogPlugin,
  Form,
  FormItem,
  Input,
  InputGroup, InputNumber,
  TabPanel, Tabs, Textarea
} from "tdesign-vue-next";
import {NewsIndex, NewsContent, buildNewsContent} from "@/entity/news";
import {useNewsStore} from "@/store/db/NewsStore";
import {isEmptyString} from "@/utils/lang/FieldUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {getLogoFromUrl} from "@/utils/lang/DocumentUtil";

export async function postNews(old?: NewsIndex) {
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
  const getLogoLoading = ref(false);

  function getLogo() {
    if (!form.value.url) return MessageUtil.warning("请先输入链接")
    getLogoLoading.value = true;
    getLogoFromUrl(form.value.url)
      .then((logo) => {
        form.value.icon = logo;
      })
      .finally(() => {
        getLogoLoading.value = false;
      });
  }

  const plugin = DialogPlugin({
    header: action + '插件',
    placement: 'center',
    draggable: true,
    width: 600,
    confirmBtn: {
      default: action
    },
    default: () => <Tabs defaultValue={'1'}>
      <TabPanel value={'1'} label={'基本设置'} style={{padding: '0 4px'}}>
        <Form data={form.value}>
          <FormItem label={'名称'} name={'name'} labelAlign={'top'}>
            <Input v-model={form.value.name} clearable={true}/>
          </FormItem>
          <FormItem label={'图标'} name={'icon'} labelAlign={'top'}>
            <Input v-model={form.value.icon} clearable={true}/>
          </FormItem>
          <FormItem label={'链接'} name={'url'} labelAlign={'top'}>
            <InputGroup class={'w-full'}>
              <Input v-model={form.value.url} clearable={true}/>
              <Button theme={'primary'} disabled={isEmptyString(form.value.url)} onClick={getLogo}>获取图标</Button>
            </InputGroup>
          </FormItem>
        </Form>
      </TabPanel>
      <TabPanel value={'3'} label={'网络设置'} style={{padding: '0 4px'}}>
        <Form data={form.value}>
          <FormItem label={'等待时间|等待元素出现'} name={'wait'} labelAlign={'top'}>
            <Input v-model={form.value.wait} clearable={true}/>
          </FormItem>
          <FormItem label={'超时时间'} name={'timeout'} labelAlign={'top'}
                    help={'单位ms，默认2000ms。超时后，页面不会被终止，并且将被refetch。'}>
            <InputNumber v-model={form.value.timeout}/>
          </FormItem>
          <FormItem label={'User-Agent'} name={'userAgent'} labelAlign={'top'}>
            <Textarea v-model={form.value.userAgent} autosize={{minRows: 3, maxRows: 6}}/>
          </FormItem>
        </Form>
      </TabPanel>
      <TabPanel value={'4'} label={'内容设置'} style={{padding: '4px'}}>
        <Form data={form.value}>
          <FormItem label={'标题规则'} name={'title'} labelAlign={'top'}>
            <Input v-model={form.value.title} clearable={true}/>
          </FormItem>
          <FormItem label={'内容规则'} name={'body'} labelAlign={'top'}>
            <Input v-model={form.value.body} clearable={true}/>
          </FormItem>
        </Form>
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