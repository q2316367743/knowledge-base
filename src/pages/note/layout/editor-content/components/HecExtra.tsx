import {getDefaultArticleBase} from "@/entity/article";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {useArticleStore} from "@/store/db/ArticleStore";
import {homeEditorId} from "@/store/components/HomeEditorStore";
import {useCategoryStore} from "@/store/db/CategoryStore";
import {getFromOneWithDefaultByAsync} from "@/utils/utools/DbStorageUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import {Button, DrawerPlugin, Form, FormItem, Input, TagInput, Textarea, TreeSelect} from "tdesign-vue-next";
import {openCategoryManageDrawer} from "@/pages/note/components/CategoryManageDrawer";

export async function openHeExtra(id: number, readonly = false) {
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
  const dp = DrawerPlugin({
    header: '信息',
    size: '400px',
    confirmBtn: '保存',
    default: () => <Form data={base.value} layout="vertical">
      <FormItem label="来源" labelAlign={'top'}>
        {{
          default: () => <Input v-model={base.value.source} maxlength={32} readonly={readonly}/>,
          help: () => <span>最大32个字</span>
        }}
      </FormItem>
      <FormItem label="来源链接" labelAlign={'top'}>
        <Input v-model={base.value.sourceUrl} maxlength={255} readonly={readonly}/>
      </FormItem>
      <FormItem labelAlign={'top'}>
        {{
          label: () => <div
            style={{display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center'}}>
            <div>分类</div>
            <Button variant={'text'} theme={'primary'} size={'small'} onClick={openCategoryManageDrawer}>管理</Button>
          </div>,
          default: () => <TreeSelect v-model={categoryId.value} placeholder="请选择分类" clearable={true}
                                     data={categoryTree.value} readonly={readonly}/>,
        }}
      </FormItem>
      <FormItem label="标签" labelAlign={'top'}>
        {{
          default: () => <TagInput v-model={base.value.tags} placeholder="请输入标签" clearable={true}
                                   readonly={readonly}>
          </TagInput>,
          help: () => <span>按回车新增标签</span>
        }}
      </FormItem>
      <FormItem label="描述" labelAlign={'top'}>
        <Textarea v-model={base.value.description} autosize={{minRows: 4}} readonly={readonly}
                  placeholder="请输入描述，不能超过64个字" maxlength={64}/>
      </FormItem>
    </Form>,
    onConfirm: () => {
      useArticleStore().updateBase(homeEditorId.value, {
        categoryId: categoryId.value
      }, base.value, rev)
        .then(() => {
          MessageUtil.success("保存成功");
          dp.destroy?.();
        })
        .catch(e => MessageUtil.error("保存失败", e));
    }
  })

}
