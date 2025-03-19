import {getDefaultArticleBase} from "@/entity/article";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useArticleStore} from "@/store/db/ArticleStore";
import {homeEditorId} from "@/store/components/HomeEditorStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {getFromOneWithDefaultByAsync} from "@/utils/utools/DbStorageUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {Drawer} from "@arco-design/web-vue";
import {Button, Form, FormItem, Input, TagInput, Textarea, TreeSelect} from "tdesign-vue-next";
import {openCategoryManageDrawer} from "@/pages/note/components/CategoryManageDrawer";

export async function openHeExtra(id: number) {
  const categoryTree = computed(() => useCategoryStore().categoryTree);
  const categoryId = ref<number | undefined>(undefined);
  const base = ref(getDefaultArticleBase());
  let rev: undefined | string;
  if (id === 0) {
    base.value = getDefaultArticleBase();
  } else {
    const articleIndex = useArticleStore().articleMap.get(id);
    if (articleIndex) {
      categoryId.value = articleIndex.categoryId;
    } else {
      categoryId.value = undefined;
    }
    const res = await getFromOneWithDefaultByAsync(LocalNameEnum.ARTICLE_BASE + homeEditorId.value, getDefaultArticleBase())
    base.value = res.record;
    rev = res.rev;
  }
  Drawer.open({
    title: '信息',
    width: 400,
    okText: '保存',
    content: () => <Form data={base.value} layout="vertical">
      <FormItem label="来源" labelAlign={'top'}>
        {{
          default: () => <Input v-model={base.value.source} maxlength={32}/>,
          help: () => <span>最大32个字</span>
        }}
      </FormItem>
      <FormItem label="来源链接" labelAlign={'top'}>
        <Input v-model={base.value.sourceUrl} maxlength={255}/>
      </FormItem>
      <FormItem label={'分类'} labelAlign={'top'}>
        {{
          label: () => <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            <div>分类</div>
            <Button variant={'text'} theme={'primary'} size={'small'} onClick={openCategoryManageDrawer}>管理</Button>
          </div>,
          default: () => <TreeSelect v-model={categoryId.value} placeholder="请选择分类" clearable={true}
                                     data={categoryTree.value}/>,
        }}
      </FormItem>
      <FormItem label="标签" labelAlign={'top'}>
        {{
          default: () => <TagInput v-model={base.value.tags} placeholder="请输入标签" clearable={true}>
          </TagInput>,
          help: () => <span>按回车新增标签</span>
        }}
      </FormItem>
      <FormItem label="描述" labelAlign={'top'}>
        <Textarea v-model={base.value.description} autosize={{minRows: 4}}
                  placeholder="请输入描述，不能超过64个字" maxlength={64}/>
      </FormItem>
    </Form>,
    onOk: () => {
      useArticleStore().updateBase(homeEditorId.value, {
        categoryId: categoryId.value
      }, base.value, rev)
        .then(() => MessageUtil.success("保存成功"))
        .catch(e => MessageUtil.error("保存失败", e));
    }
  })

}
