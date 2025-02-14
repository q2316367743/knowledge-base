import {getDefaultArticleBase} from "@/entity/article";
import {useArticleStore} from "@/store/db/ArticleStore";
import {getFromOneWithDefaultByAsync} from "@/utils/utools/DbStorageUtil";
import LocalNameEnum from "@/enumeration/LocalNameEnum";
import {homeEditorId} from "@/store/components/HomeEditorStore";
import {computed, ref} from "vue";
import {Button, Drawer, Form, FormItem, Input, Select, Textarea, TreeSelect} from "@arco-design/web-vue";
import {useCategoryStore} from "@/store/db/CategoryStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {openCategoryManageDrawer} from "@/pages/home/components/CategoryManageDrawer";

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
    content: () => <Form model={base.value} layout="vertical">
      <FormItem label="来源">
        {{
          default: () => <Input v-model={base.value.source} maxLength={32}/>,
          help: () => <span>最大32个字</span>
        }}
      </FormItem>
      <FormItem label="来源链接">
        <Input v-model={base.value.sourceUrl} maxLength={255}/>
      </FormItem>
      <FormItem>
        {{
          label: () => <div style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
            <div>分类</div>
            <Button type={'text'} size={'mini'} onClick={openCategoryManageDrawer}>管理</Button>
          </div>,
          default: () => <TreeSelect v-model={categoryId.value} placeholder="请选择分类" scrollbar allowClear
                                     data={categoryTree.value} allowSearch/>
        }}
      </FormItem>
      <FormItem label="标签">
        {{
          default: () => <Select v-model={base.value.tags} placeholder="请输入标签" multiple scrollbar
                                 allowClear
                                 allowSearch allowCreate>
          </Select>,
          help: () => <span>按回车新增标签</span>
        }}
      </FormItem>
      <FormItem label="描述">
        <Textarea v-model={base.value.description} autoSize={{minRows: 4}}
                  placeholder="请输入描述，不能超过64个字"
                  allowClear maxLength={64} showWordLimit/>
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
