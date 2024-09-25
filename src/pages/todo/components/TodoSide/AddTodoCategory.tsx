import {Ref, ref} from "vue";
import TodoListSortEnum from "@/enumeration/TodoListSortEnum";
import {Form, FormItem, Input, Modal, Radio, RadioGroup} from "@arco-design/web-vue";
import {
    getDefaultTodoCategory, renderTodoCategoryType,
    TodoCategoryRecord,
    TodoCategoryTypeEnum,
    TodoListLayoutEnum
} from "@/entity/todo/TodoCategory";
import {useTodoCategoryStore} from "@/store/db/TodoCategoryStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import {clone} from "@/utils/lang/ObjectUtil";
import {useTodoStore} from "@/store/components/TodoStore";
import {access} from "@/plugin/Statistics";


function renderContent(record: Ref<TodoCategoryRecord>, allowType: boolean) {
    return () => <Form model={record.value} layout={'vertical'}>
        <FormItem label="名称">
            <Input v-model={record.value.name} allow-clear/>
        </FormItem>
        {allowType && <FormItem label="类型">
            <RadioGroup v-model={record.value.type}>
                <Radio value={TodoCategoryTypeEnum.FOLDER}>文件夹</Radio>
                <Radio value={TodoCategoryTypeEnum.TODO}>清单</Radio>
            </RadioGroup>
        </FormItem>}
        {record.value.type === TodoCategoryTypeEnum.TODO && <FormItem label="布局">
            <RadioGroup v-model={record.value.todoListLayout}>
                <Radio value={TodoListLayoutEnum.DEFAULT}>默认布局</Radio>
                <Radio value={TodoListLayoutEnum.CARD}>卡片布局</Radio>
                <Radio value={TodoListLayoutEnum.CALENDAR}>日历布局</Radio>
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
        hideOfTodo: false,
        hideOfAbandon: false,
        hideOfArticle: false,
        hideOfComplete: false,
        hideOfDoing: false
    });

    Modal.open({
        title: "新增待办分类",
        draggable: true,
        okText: '新增',
        content: renderContent(record, true),
        async onBeforeOk() {
            try {
                await useTodoCategoryStore().add(record.value);
                MessageUtil.success("新增成功");
                access(`新增${renderTodoCategoryType(record.value.type)}`);
                return true;
            } catch (e) {
                MessageUtil.error("新增失败", e);
                return false;
            }
        }
    })

}

export function openUpdateTodoCategory(id: number) {
    // 此处先查询
    const temp = useTodoCategoryStore().todoCategoryMap.get(id);
    if (!temp) {
        MessageUtil.error("系统异常，待办分类不存在，请刷新后重试");
        return;
    }
    const record = ref<TodoCategoryRecord>(clone(getDefaultTodoCategory(temp), true));

    Modal.open({
        title: "修改待办分类",
        draggable: true,
        okText: '更新',
        content: renderContent(record, false),
        async onBeforeOk() {
            try {
                await useTodoCategoryStore().update(id, record.value);
                if (id === useTodoStore().id) {
                    useTodoStore().setId(id);
                }
                MessageUtil.success("修改成功");
                return true;
            } catch (e) {
                MessageUtil.error("修改失败", e);
                return false;
            }
        }
    })

}
