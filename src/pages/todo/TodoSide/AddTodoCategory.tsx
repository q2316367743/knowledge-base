import {useUmami} from "@/plugin/umami";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {DialogPlugin, Form, FormItem, Input, Radio, RadioGroup} from "tdesign-vue-next";
import {
  getDefaultTodoCategory,
  renderTodoCategoryType,
  TodoCategoryGroupEnum,
  TodoCategoryRecord,
  TodoCategoryTypeEnum,
  TodoListLayoutEnum
} from "@/entity/todo/TodoCategory";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {clone} from "@/utils/lang/ObjectUtil";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";


function renderContent(record: Ref<TodoCategoryRecord>, allowType: boolean) {
  return () => <Form data={record.value}>
    <FormItem label="名称" labelAlign={'top'}>
      <Input v-model={record.value.name} clearable={true} autofocus />
    </FormItem>
    {allowType && <FormItem label="类型" labelAlign={'top'}>
      <RadioGroup v-model={record.value.type}>
        <Radio value={TodoCategoryTypeEnum.FOLDER}>文件夹</Radio>
        <Radio value={TodoCategoryTypeEnum.TODO}>清单</Radio>
      </RadioGroup>
    </FormItem>}
    {record.value.type === TodoCategoryTypeEnum.TODO && <FormItem label="布局" labelAlign={'top'}>
      <RadioGroup v-model={record.value.todoListLayout}>
        <Radio value={TodoListLayoutEnum.DEFAULT}>默认布局</Radio>
        <Radio value={TodoListLayoutEnum.CARD}>卡片布局</Radio>
        <Radio value={TodoListLayoutEnum.CALENDAR}>日历布局</Radio>
        <Radio value={TodoListLayoutEnum.FOUR_QUADRANTS}>四象限</Radio>
      </RadioGroup>
    </FormItem>}
  </Form>;
}

export function openAddTodoCategory(pid: number) {
  const record = ref<TodoCategoryRecord>({
    name: '',
    pid: pid,
    type: TodoCategoryTypeEnum.FOLDER,
    todoListSort: TodoListSortEnum.PRIORITY,
    todoListLayout: TodoListLayoutEnum.DEFAULT,
    hideOfArticle: false,
    groupType: TodoCategoryGroupEnum.DEFAULT,
    hideOfCompleteOrAbandon: false,
    showAddGroupBtn: true
  });

  const instance = DialogPlugin({
    header: "新增待办分类",
    placement: 'center',
    draggable: true,
    confirmBtn: '新增',
    default: renderContent(record, true),
    async onConfirm() {
      try {
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
