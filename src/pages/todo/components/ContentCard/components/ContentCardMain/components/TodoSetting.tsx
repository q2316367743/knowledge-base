import {Checkbox, CheckboxGroup, Drawer, Form, FormItem, Radio, RadioGroup} from "@arco-design/web-vue";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import {useTodoStore} from "@/store/components/TodoStore";
import {ref} from "vue";
import {contains} from "@/utils/lang/ArrayUtil";
import {TodoCategoryTypeEnum, TodoListLayoutEnum} from "@/entity/todo/TodoCategory";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";

export function openTodoSetting() {
    const todoCategory = useTodoCategoryStore().todoCategoryMap.get(useTodoStore().categoryId);
    if (!todoCategory) {
        return;
    }
    const hides = ref<Array<string>>([]);
    todoCategory.hideOfTodo && hides.value.push('1');
    todoCategory.hideOfComplete && hides.value.push('2');
    todoCategory.hideOfAbandon && hides.value.push('3');
    todoCategory.hideOfArticle && hides.value.push('4');
    todoCategory.hideOfDoing && hides.value.push('5');
    const config = ref({
        todoListLayout: todoCategory.todoListLayout
    });
    Drawer.open({
        title: '待办设置',
        okText: "保存",
        width: 400,
        content: () => <Form model={config.value} layout={'vertical'}>
            <FormItem label={'模块开关'}>
                <CheckboxGroup v-model={hides.value}>
                    <Checkbox value={'1'}>隐藏待办</Checkbox>
                    <Checkbox value={'5'}>隐藏进行</Checkbox>
                    <Checkbox value={'2'}>隐藏完成</Checkbox>
                    <Checkbox value={'3'}>隐藏放弃</Checkbox>
                    <Checkbox value={'4'}>隐藏文章</Checkbox>
                </CheckboxGroup>
            </FormItem>
            <FormItem label="布局">
                <RadioGroup v-model={config.value.todoListLayout}>
                    <Radio value={TodoListLayoutEnum.DEFAULT}>默认布局</Radio>
                    <Radio value={TodoListLayoutEnum.CARD}>卡片布局</Radio>
                    <Radio value={TodoListLayoutEnum.CALENDAR}>日历布局</Radio>
                </RadioGroup>
            </FormItem>
        </Form>,
        onOk() {
            useTodoCategoryStore().update(todoCategory.id, {
                hideOfTodo: contains(hides.value, '1'),
                hideOfComplete: contains(hides.value, '2'),
                hideOfAbandon: contains(hides.value, '3'),
                hideOfArticle: contains(hides.value, '4'),
                todoListLayout: config.value.todoListLayout
            }).then(() => useTodoStore().setId(todoCategory.id))
        }
    })
}
