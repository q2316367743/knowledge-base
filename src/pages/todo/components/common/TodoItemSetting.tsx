import {handlePriorityColor, TodoItemAttr, TodoItemIndex, TodoItemPriority} from "@/entity/todo/TodoItem";
import {
    Button, DatePicker,
    Drawer,
    Form,
    FormItem, Popconfirm,
    Radio,
    RadioGroup, RangePicker,
    Space, Switch,
    Tag,
    Textarea
} from "@arco-design/web-vue";
import {ref, watch} from "vue";
import MessageBoxUtil from "@/utils/modal/MessageBoxUtil";
import {useTodoStore} from "@/store/components/TodoStore";
import {IconEdit} from "@arco-design/web-vue/es/icon";
import {clone} from "@/utils/lang/ObjUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import RichTextEditor from "@/editor/RichTextEditor/index.vue";

function renderIsRange(attr: TodoItemAttr): boolean {
    if (attr.start === '' && attr.end === '') {
        return false;
    }
    return attr.start !== attr.end;

}

export async function openTodoItemSetting(index: TodoItemIndex, toUpdate?: (index: TodoItemIndex) => void) {
    const base = ref(clone(index, true));
    const todoItem = await useTodoStore().getTodoItem(index.id);
    const content = ref(todoItem.content);
    const attr = ref<TodoItemAttr>(await useTodoStore().getTodoItemAttr(index.id));
    const isRange = ref(renderIsRange(attr.value));
    const range = ref([attr.value.start, attr.value.end]);

    watch(() => range.value[0], (newValue) => {
        if (!isRange.value) {
            range.value[1] = newValue;
        }
    })

    const startAddTag = () => MessageBoxUtil.prompt("请输入标签名字").then(tag => content.value.record.tags.push(tag));

    function _openInfo() {
        openInfo(content.value.record.content).then(res => content.value.record.content = res);
    }

    function closeTag(e: string) {
        content.value.record.tags = content.value.record.tags.filter((tag) => tag !== e);
    }

    function onClose() {
        open.close();
    }

    async function onBeforeOk() {
        // 先更新索引
        await useTodoStore().updateById(index.id, base.value, {
            ...attr.value,
            start: range.value[0],
            end: range.value[1]
        });
        // 再更新属性
        // 再更新内容
        await useTodoStore().saveContent(index.id, content.value.record, content.value.rev);
        MessageUtil.success("保存成功");
        onClose();
        toUpdate && toUpdate(base.value);
    }

    function onRemove() {
        useTodoStore().removeById(index.id)
            .then(() => {
                MessageUtil.success("删除成功");
                onClose();
            })
            .catch(e => MessageUtil.error("删除失败", e));
    }

    const open = Drawer.open({
        title: '待办详情',
        width: 400,
        content: () => <Form model={base.value} layout={'vertical'}>
            <FormItem>
                <Textarea v-model={base.value.title} allowClear placeholder="请输入待办"
                          autoSize={{minRows: 2, maxRows: 8}}/>
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
            <FormItem label={'置顶'}>
                <Switch v-model={base.value.top}/>
            </FormItem>
            <FormItem>
                {{
                    label: () => <RadioGroup v-model={isRange.value} type={'button'}>
                        <Radio value={false}>时间</Radio>
                        <Radio value={true}>时间段</Radio>
                    </RadioGroup>,
                    default: () => {
                        if (isRange.value) {
                            return <RangePicker v-model={range.value}></RangePicker>
                        } else {
                            return <DatePicker v-model={range.value[0]}></DatePicker>
                        }
                    }
                }}
            </FormItem>
            <FormItem label={'标签'}>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {content.value.record.tags.map(tag =>
                        <Tag color={'arcoblue'} style={{marginRight: '4px', marginBottom: '4px'}} closable
                             onClose={() => closeTag(tag)}>{tag}</Tag>)}
                    <Button size={'mini'} type={'primary'} onClick={startAddTag}>新增</Button>
                </div>
            </FormItem>
            <FormItem>
                {{
                    label: () => <div>
                        <span>备注</span>
                        <Button size={'mini'} type={'text'} style={{marginLeft: '7px'}} onClick={_openInfo}>
                            {{
                                icon: () => <IconEdit/>
                            }}
                        </Button></div>,
                    default: () => content.value.record.content ?
                        <div innerHTML={content.value.record.content}></div> :
                        <div style={{color: 'var(--color-text-3)'}}>请输入备注</div>
                }}
            </FormItem>
        </Form>,
        footer: () => <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <Popconfirm content={'是否删除此待办，删除后不可恢复'} onOk={onRemove} okText={'删除'}
                        okButtonProps={{status: 'danger'}}>
                <Button type={'primary'} status={'danger'}>删除</Button>
            </Popconfirm>
            <Space>
                <Button onClick={onClose}>取消</Button>
                <Button type={'primary'} onClick={onBeforeOk}>保存</Button>
            </Space>
        </div>
    });
}

export function openInfo(_content: string) {

    const content = ref(_content);
    return new Promise<string>(resolve => {


        Drawer.open({
            width: 600,
            title: '备注',
            content: () => <RichTextEditor v-model={content.value}/>,
            okText: '保存',
            onOk() {
                resolve(content.value);
            }
        })
    })
}
