import {useUmami} from "@/plugin/umami";
import {DialogPlugin, Form, FormItem, Input, Radio, RadioGroup} from "tdesign-vue-next";
import {
  getDefaultTodoCategory,
  renderTodoCategoryType,
  TodoCategoryOpenTypeEnum,
  TodoCategoryRecord,
  TodoCategoryTypeEnum,
  TodoListLayoutEnum
} from "@/entity/todo/TodoCategory";
import VipIcon from "@/components/KbIcon/VipIcon.vue";
import {checkPower, useTodoCategoryStore, useTodoWrapStore, useVipStore} from "@/store";
import MessageUtil from "@/utils/modal/MessageUtil";
import {clone} from "@/utils/lang/ObjectUtil";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";


function renderContent(record: Ref<TodoCategoryRecord>, allowType: boolean) {
  const {todoNoVip} = useVipStore();
  const isUtools = InjectionUtil.getPlatform() === 'uTools';
  return () => <Form data={record.value}>
    <FormItem label="名称" labelAlign={'top'}>
      <Input v-model={record.value.name} clearable={true} autofocus/>
    </FormItem>
    {allowType && <FormItem label="类型" labelAlign={'top'}>
      <RadioGroup v-model={record.value.type}>
        <Radio value={TodoCategoryTypeEnum.FOLDER}>文件夹</Radio>
        <Radio value={TodoCategoryTypeEnum.TODO}>清单</Radio>
      </RadioGroup>
    </FormItem>}
    {record.value.type === TodoCategoryTypeEnum.TODO && <>
      <FormItem label="布局" labelAlign={'top'}>
        <RadioGroup v-model={record.value.todoListLayout}
                    disabled={record.value.openType === TodoCategoryOpenTypeEnum.WIDGET}>
          <Radio value={TodoListLayoutEnum.DEFAULT}>默认布局</Radio>
          <Radio value={TodoListLayoutEnum.CARD}>卡片布局</Radio>
          <Radio value={TodoListLayoutEnum.CALENDAR}>日历布局</Radio>
          <Radio value={TodoListLayoutEnum.FOUR_QUADRANTS}>四象限</Radio>
        </RadioGroup>
      </FormItem>
      {isUtools && <FormItem label="默认打开方式" labelAlign={'top'}>
        <RadioGroup v-model={record.value.openType} defaultValue={TodoCategoryOpenTypeEnum.PLUGIN}>
          <Radio value={TodoCategoryOpenTypeEnum.PLUGIN}>插件内</Radio>
          <Radio value={TodoCategoryOpenTypeEnum.WIDGET}>
            <div class={'flex items-center'}>
              <div>小部件</div>
              {todoNoVip && <VipIcon style={{marginLeft: '4px'}}/>}
            </div>
          </Radio>
        </RadioGroup>
      </FormItem>}
    </>}
  </Form>;
}

export function openAddTodoCategory(pid: number) {
  const record = ref<TodoCategoryRecord>(getDefaultTodoCategory({
    pid: pid,
  }));

  const instance = DialogPlugin({
    header: "新增待办分类",
    placement: 'center',
    draggable: true,
    confirmBtn: '新增',
    default: renderContent(record, true),
    async onConfirm() {
      try {
        if (record.value.openType === TodoCategoryOpenTypeEnum.WIDGET) {
          await checkPower('todo');
        }
        await useTodoCategoryStore().add(record.value);
        MessageUtil.success("新增成功");
        useUmami.track(`/待办/新增/${renderTodoCategoryType(record.value.type)}`);
        instance.destroy();
        return true;
      } catch (e) {
        MessageUtil.error("新增失败", e);
        return false;
      }
    }
  });

}

export function openUpdateTodoCategory(id: number) {
  // 此处先查询
  const temp = useTodoCategoryStore().todoCategoryMap.get(id);
  if (!temp) {
    MessageUtil.error("系统异常，待办分类不存在，请刷新后重试");
    return;
  }
  const record = ref<TodoCategoryRecord>(clone(getDefaultTodoCategory(temp), true));

  const instance = DialogPlugin({
    header: "修改待办分类",
    placement: 'center',
    draggable: true,
    confirmBtn: '更新',
    default: renderContent(record, false),
    async onConfirm() {
      try {
        if (record.value.openType === TodoCategoryOpenTypeEnum.WIDGET) {
          await checkPower('todo');
        }
        await useTodoCategoryStore().update(id, record.value);
        if (id === useTodoWrapStore().categoryId) {
          await useTodoWrapStore().init(id);
        }
        MessageUtil.success("修改成功");
        instance.destroy();
        return true;
      } catch (e) {
        MessageUtil.error("修改失败", e);
        return false;
      }
    }
  })
}

export function openDeleteTodoCategory(id: number, title: string) {
  MessageBoxUtil.confirm("确认删除清单【" + title + '】吗，删除时会将清单下全部待办一并删除', "删除", {
    confirmButtonText: "删除",
    cancelButtonText: "取消"
  }).then(() => useTodoCategoryStore().remove(id)
    .then(() => MessageUtil.success("删除成功"))
    .catch(e => MessageUtil.error("删除失败", e)));
}
