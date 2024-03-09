import {handlePriorityColor, TodoItemIndex, TodoItemPriority} from "@/entity/todo/TodoItem";
import {Button, Drawer, Form, FormItem, Input, Radio, RadioGroup, Tag} from "@arco-design/web-vue";
import {ref} from "vue";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {useTodoStore} from "@/store/components/TodoStore";
import {IconEdit} from "@arco-design/web-vue/es/icon";
import {clone} from "xe-utils";

export async function openTodoItemInfo(index: TodoItemIndex) {
    const base = ref(clone(index, true));
    const todoItem = await useTodoStore().getTodoItem(index.id);
    const content = ref(todoItem.content);

    const startAddTag = () => MessageBoxUtil.prompt("请输入标签名字").then(tag => content.value.record.tags.push(tag));


    Drawer.open({
        title: '待办详情',
        width: 400,
        content: () => <Form model={base.value} layout={'vertical'}>
            <FormItem>
                <Input v-model={base.value.title} allowClear class="input" placeholder="请输入待办"/>
            </FormItem>
            <FormItem label={'优先级'}>
                <RadioGroup v-model={base.value.priority} type={'button'}>
                    <Radio value={TodoItemPriority.HIGH}
                           style={{color: handlePriorityColor(TodoItemPriority.HIGH)}}>高优先级</Radio>
                    <Radio value={TodoItemPriority.MIDDLE}
                           style={{color: handlePriorityColor(TodoItemPriority.MIDDLE)}}>中优先级</Radio>
                    <Radio value={TodoItemPriority.FLOOR}
                           style={{color: handlePriorityColor(TodoItemPriority.FLOOR)}}>低优先级</Radio>
                    <Radio value={TodoItemPriority.NONE}
                           style={{color: handlePriorityColor(TodoItemPriority.NONE)}}>无优先级</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label={'标签'}>
                {content.value.record.tags.map(tag => <Tag color={'arcoblue'} style={{marginRight: '4px'}}>{tag}</Tag>)}
                <Button size={'mini'} type={'primary'} onClick={startAddTag}>新增</Button>
            </FormItem>
            <FormItem>
                {{
                    label: () => <div>备注<Button size={'mini'} type={'text'} style={{marginLeft: '7px'}}>
                        {{
                            icon: () => <IconEdit/>
                        }}
                    </Button></div>,
                    default: () => content.value.record.content || '请输入备注'
                }}
            </FormItem>
        </Form>,
        okText: '保存',
        async onBeforeOk() {
            // 先更新索引
            await useTodoStore().updateById(index.id, base.value);
            // 再更新内容
            await useTodoStore().saveContent(index.id, content.value.record, content.value.rev);
            return true;
        }
    })
}

