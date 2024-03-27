import {handlePriorityColor, handlePriorityText, TodoItemIndex} from "@/entity/todo/TodoItem";
import {useTodoStore} from "@/store/components/TodoStore";
import {
    Descriptions, DescriptionsItem, Drawer, Tag
} from "@arco-design/web-vue";
import {ref} from "vue";
import {handleDate} from "@/utils/lang/ObjUtil";
import {toDateString} from "xe-utils";
import {IconClockCircle} from "@arco-design/web-vue/es/icon";

export async function openTodoItemInfo(index: TodoItemIndex) {
    const todoItem = await useTodoStore().getTodoItem(index.id);

    const content = todoItem.content;
    const start = ref('');
    const end = ref('');
    const hasAttr = ref(false);
    const attr = todoItem.attr;
    if (attr.start !== '') {
        start.value = handleDate(attr.start);
        hasAttr.value = true;
    }
    if (attr.end !== '' && attr.start !== attr.end && attr.start !== '') {
        start.value = toDateString(attr.start, "yyyy-MM-dd");
        end.value = toDateString(attr.end, "yyyy-MM-dd");
        hasAttr.value = true;
    }

    Drawer.open({
        header: false,
        width: 400,
        content: () => <Descriptions column={1} layout={'vertical'}>
            <DescriptionsItem label={'待办详情'}>
                {index.title}
            </DescriptionsItem>
            <DescriptionsItem label={'优先级'}>
                <div style={{color: handlePriorityColor(index.priority)}}>{handlePriorityText(index.priority)}</div>
            </DescriptionsItem>
            {hasAttr.value && <DescriptionsItem label={'时间'}>
                <Tag color="orange">
                    {{
                        icon: () => <IconClockCircle/>,
                        default: () => <span>{start.value}{end.value ? ' · ' + end.value : ''}</span>
                    }}
                </Tag>
            </DescriptionsItem>}
            <DescriptionsItem label={'标签'}>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {content.record.tags.length > 0 ? content.record.tags.map(tag =>
                        <Tag color={'arcoblue'} style={{marginRight: '4px', marginBottom: '4px'}}>{tag}</Tag>) :
                    <div>暂无标签</div>}
                </div>
            </DescriptionsItem>
            <DescriptionsItem label={'备注'}>
                {{
                    default: () => content.record.content ?
                        <div innerHTML={content.record.content} ></div> :
                        <div style={{color: 'var(--color-text-3)'}}>请输入备注</div>
                }}
            </DescriptionsItem>
        </Descriptions>,
        footer: false
    });
}
