// @ts-nocheck
import {useTodoStore} from "@/store/components/TodoStore";
import {
    Col,
    Input,
    Drawer,
    Row,
    Select,
    Option,
    Button,
    DatePicker,
    List,
    ListItem,
    ListItemMeta,
    Space,
    Tag
} from "@arco-design/web-vue";
import {IconSearch} from "@arco-design/web-vue/es/icon";
import {ref} from "vue";
import dayjs from "dayjs";
import {
    handlePriorityColor,
    handlePriorityText, handleSimplePriorityColor, handleStatusText,
    TodoItemIndex,
    TodoItemPriority,
    TodoItemStatus
} from "@/entity/todo/TodoItem";
import {toDateString} from "@/utils/lang/FormatUtil";
import {openTodoItemInfo} from "@/pages/todo/components/common/TodoItemInfo";

interface FormInterface {
    title: string,
    createTimeStart: string,
    createTimeEnd: string,
    status?: TodoItemStatus,
    priority?: TodoItemPriority,
}

export function todoSearch() {
    // 获取全部的待办列表
    const todoList = ref(new Array<TodoItemIndex>());
    const loading = ref(false);


    const form = ref<FormInterface>({
        title: '',
        createTimeStart: '',
        createTimeEnd: '',
    });

    function handleSearch() {
        if (loading.value) {
            return;
        }
        // 重置
        loading.value = true;
        todoList.value = [];
        // 获取待办列表
        const {todoItems} = useTodoStore();
        try {
            console.log(form.value, todoItems)
            // 过滤待办列表
            todoList.value = todoItems.filter(item => {
                const {title, createTime, status, priority} = item;
                const {
                    title: formTitle,
                    createTimeStart,
                    createTimeEnd,
                    status: formStatus,
                    priority: formPriority
                } = form.value;
                return (
                    (formTitle === '' || title.includes(formTitle)) &&
                    (createTimeStart === '' || dayjs(createTime).isAfter(createTimeStart, 'day')) &&
                    (createTimeEnd === '' || dayjs(createTime).isBefore(createTimeEnd, 'day')) &&
                    (formStatus === undefined || status === formStatus) &&
                    (formPriority === undefined || priority === formPriority)
                )
            });
        } finally {
            loading.value = false;
        }
    }

    Drawer.open({
        title: '搜索待办事项',
        width: 600,
        content: () => <div>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Input placeholder="搜索待办事项">{{
                        suffix: () => <IconSearch/>,
                    }}</Input>
                </Col>
                <Col span={6}>
                    <Select v-model={form.value.status} placeholder="状态">
                        <Option value={undefined}>全部状态</Option>
                        <Option value={TodoItemStatus.TODO}>待办</Option>
                        <Option value={TodoItemStatus.DOING}>进行中</Option>
                        <Option value={TodoItemStatus.COMPLETE}>已完成</Option>
                        <Option value={TodoItemStatus.ABANDON}>已放弃</Option>
                    </Select>
                </Col>
                <Col span={6}>
                    <Select v-model={form.value.priority} placeholder="优先级">
                        <Option value={undefined}>全部优先级</Option>
                        <Option value={TodoItemPriority.NONE}>无</Option>
                        <Option value={TodoItemPriority.FLOOR}>低</Option>
                        <Option value={TodoItemPriority.MIDDLE}>中</Option>
                        <Option value={TodoItemPriority.HIGH}>高</Option>
                    </Select>
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <DatePicker
                        placeholder="创建时间开始"
                        v-model={form.value.createTimeStart}
                        style="width: 100%"
                    />
                </Col>
                <Col span={12}>
                    <DatePicker
                        placeholder="创建时间结束"
                        v-model={form.value.createTimeEnd}
                        style="width: 100%"
                    />
                </Col>
            </Row>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <div style="text-align: right">
                        <Button type="primary" onClick={handleSearch}>搜索</Button>
                    </div>
                </Col>
            </Row>
            <List loading={loading.value} style="margin-top: 16px">
                {todoList.value.map(item => (
                    <ListItem key={item.id}>{{
                        default: () => <>
                            <div>{item.title}</div>
                            <Space>
                                <Tag
                                    color={handleSimplePriorityColor(item.priority)}>优先级：{handlePriorityText(item.priority)}</Tag>
                                <Tag color={'arcoblue'}>状态：{handleStatusText(item.status)}</Tag>
                                <Tag color={'orange'}>创建时间：{toDateString(item.createTime)}</Tag>
                            </Space>
                        </>,
                        actions: () => <Button type="text" onClick={() => openTodoItemInfo(item)}>查看详情</Button>
                    }}</ListItem>))
                }
            </List>
        </div>
    })
}
