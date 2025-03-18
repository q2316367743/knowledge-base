import {Checkbox, Drawer, Form, FormItem, Radio, RadioGroup, TypographyParagraph} from "@arco-design/web-vue";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {TodoListLayoutEnum} from "@/entity/todo/TodoCategory";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import MessageUtil from "@/utils/modal/MessageUtil";

export function openTodoSetting() {
  const todoCategory = useTodoCategoryStore().todoCategoryMap.get(useTodoWrapStore().categoryId);
  if (!todoCategory) {
    return;
  }
  const hides = ref<Array<string>>([]);
  const config = ref(todoCategory);
  Drawer.open({
    title: '待办设置',
    okText: "保存",
    width: 400,
    content: () => <Form model={config.value} layout={'vertical'}>
      <TypographyParagraph>
        <Checkbox v-model={config.value.hideOfCompleteOrAbandon}>
          隐藏已完成/放弃
        </Checkbox>
      </TypographyParagraph>
      <TypographyParagraph>
        <Checkbox v-model={config.value.hideOfArticle}>
          隐藏关联笔记
        </Checkbox>
      </TypographyParagraph>
      <TypographyParagraph>
        <Checkbox v-model={config.value.showAddGroupBtn}
                  disabled={config.value.todoListLayout !== TodoListLayoutEnum.CARD}>
          显示新增分组按钮
        </Checkbox>
      </TypographyParagraph>
      <FormItem label="布局">
        <RadioGroup v-model={config.value.todoListLayout} defaultValue={TodoListLayoutEnum.DEFAULT}>
          <Radio value={TodoListLayoutEnum.DEFAULT}>默认布局</Radio>
          <Radio value={TodoListLayoutEnum.CARD}>卡片布局</Radio>
          <Radio value={TodoListLayoutEnum.CALENDAR}>日历布局</Radio>
        </RadioGroup>
      </FormItem>
    </Form>,
    onOk() {
      useTodoCategoryStore().update(todoCategory.id, {
        hideOfCompleteOrAbandon: config.value.hideOfCompleteOrAbandon,
        hideOfArticle: config.value.hideOfArticle,
        todoListLayout: config.value.todoListLayout
      }).then(() => useTodoWrapStore().init(todoCategory.id).catch(e => MessageUtil.error("重新初始化错误", e)))
        .catch(e => MessageUtil.error("更新待办分组错误", e))
    }
  })
}
