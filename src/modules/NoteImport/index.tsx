import {DialogPlugin, FormItem, Link, Space, TabPanel, Tabs, Tag, Text, Textarea} from "tdesign-vue-next";
import {NoteImportGroups} from "@/modules/NoteImport/data";
import {importWithUBrowser} from "@/modules/NoteImport/components/importWithUBrowser";
import MessageUtil from "@/utils/modal/MessageUtil";
import {addNoteFunc} from "@/utils/component/AddNoteUtil";
import {ArticleTypeEnum} from "@/enumeration/ArticleTypeEnum";
import {useLoading} from "@/hooks";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

export function openArticleImport() {
  if (InjectionUtil.version.isSupportMarkdown()) {
    openArticleImportWithUBrowser();
  } else {
    openArticleImportWithPlugin();
  }
}

export function openArticleImportWithPlugin() {
  InjectionUtil.redirect(["网页剪报", "网页剪报"], "");
}


export function openArticleImportWithUBrowser(pid?: number) {
  const url = ref('');
  const plugin = DialogPlugin({
    header: '文章导入',
    placement: 'center',
    width: 500,
    default: () => <div class={'pl-4px pr-4px'}>
      <FormItem label={'请输入文章链接：'} labelAlign={'top'}>
        <Textarea v-model={url.value} autosize={{minRows: 3, maxRows: 9}} autofocus={true} maxlength={255}
                  placeholder={'文章链接'}/>
      </FormItem>
      <Text theme={'secondary'}>
        <p>
          <span>· 支持公众号链接、掘金等常见博客平台链接，</span>
          <Link theme={'primary'} hover={'underline'} onClick={openNoteImportSupport}>点击</Link>
          <span>查看全部支持的平台</span>
        </p>
        <p>. 公开网站链接会获取网页内的内容，可能存在多余内容，注意删减</p>
      </Text>
    </div>,
    confirmBtn: '导入',
    onConfirm: () => {
      const target = NoteImportGroups.flatMap(e => e.items).find(e => e.regex.test(url.value));
      const destroy = useLoading("正在解析中");
      importWithUBrowser(url.value, target)
        .then(res => {
          // 关闭弹窗
          plugin.destroy();
          // 新增笔记
          addNoteFunc({
            pid: pid || 0,
            type: ArticleTypeEnum.MARKDOWN,
            extra: {
              preview: true
            },
            name: res.title,
            content: res.markdown
          })
        })
        .catch(e => MessageUtil.error("笔记导入失败", e))
        .finally(() => destroy());
    }
  })
}

export function openNoteImportSupport() {
  DialogPlugin({
    header: '支持的平台',
    placement: 'center',
    footer: false,
    default: () => <Tabs defaultValue={'0'}>
      {NoteImportGroups.map(e => <TabPanel value={e.id} label={e.name}>
        <Space class={'mt-8px'}>
          {e.items.map(i => <Tag theme={'primary'}>{i.name}</Tag>)}
        </Space>
      </TabPanel>)}
    </Tabs>
  })
}