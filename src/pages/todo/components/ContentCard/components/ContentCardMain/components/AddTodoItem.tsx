import {Form, FormItem, Modal, Radio, RadioGroup, Textarea} from "@arco-design/web-vue";
import {useTodoStore} from "@/store/components/TodoStore";
import {ref} from "vue";
import {handlePriorityColor, TodoItemPriority} from "@/entity/todo/TodoItem";
import MessageUtil from "@/utils/modal/MessageUtil";

export function openAddTodoItem() {
    const record = ref({
        title: '',
        priority: TodoItemPriority.NONE
    })
    Modal.open({
        title: '新增待办',
        content: () => <Form model={record.value} layout={'vertical'}>
            <FormItem label={'标题'}>
                <Textarea autoSize={{minRows: 2, maxRows: 8}} v-model={record.value.title}
                          placeholder={'请输入待办内容'}/>
            </FormItem>
            <FormItem label={'优先级'}>
                <RadioGroup v-model={record.value.priority} type={'button'}>
                    <Radio value={TodoItemPriority.HIGH} style={{color: handlePriorityColor(TodoItemPriority.HIGH)}}>高优先级</Radio>
                    <Radio value={TodoItemPriority.MIDDLE} style={{color: handlePriorityColor(TodoItemPriority.MIDDLE)}}>中优先级</Radio>
                    <Radio value={TodoItemPriority.FLOOR} style={{color: handlePriorityColor(TodoItemPriority.FLOOR)}}>低优先级</Radio>
                    <Radio value={TodoItemPriority.NONE} style={{color: handlePriorityColor(TodoItemPriority.NONE)}}>无优先级</Radio>
                </RadioGroup>
            </FormItem>
        </Form>,
        draggable: true,
        okText: '新增',
        async onBeforeOk() {
            try {
                await useTodoStore().addSimple(record.value)
                MessageUtil.success("新增成功");
                return true;
            } catch (e) {
                MessageUtil.error("新增失败", e);
                return false;
            }

        }
    })
}
