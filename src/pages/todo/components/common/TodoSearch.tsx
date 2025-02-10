// @ts-nocheck
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Input,
  InputTag,
  List,
  ListItem,
  Option,
  Row,
  Select,
  Space,
  Tag
} from "@arco-design/web-vue";
import {ref} from "vue";
import dayjs from "dayjs";
import {
  handlePriorityText,
  handleSimplePriorityColor,
  handleStatusText,
  TodoItemAttr,
  TodoItemContent,
  TodoItemIndex,
  TodoItemPriority,
  TodoItemStatus
} from "@/entity/todo/TodoItem";
import {toDateString} from "@/utils/lang/FormatUtil";
import {openTodoItemInfo} from "@/pages/todo/components/common/TodoItemInfo";
import {randomColor} from "@/utils/BrowserUtil";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";

interface FormInterface {
  title: string,
  createTimeStart: string,
  createTimeEnd: string,
  updateTimeStart: string,
  updateTimeEnd: string,
  completeTimeStart: string,
  completeTimeEnd: string,
  status: TodoItemStatus | 0,
  priority: TodoItemPriority | 0,
  tags: Array<string>
}

interface ListItemData {
  index: TodoItemIndex;
  attr: TodoItemAttr;
  content: TodoItemContent;
}

function tagSearch(sources: Array<string>, targets: Array<string>): boolean {
  for (let target of targets) {
    if (!sources.includes(target)) {
      return false;
    }
  }
  return true;
}

export function todoSearch() {
  // 获取全部的待办列表
  const todoList = ref(new Array<ListItemData>());
  const loading = ref(false);
  const more = ref(false);


  const form = ref<FormInterface>({
    title: '',
    createTimeStart: '',
    createTimeEnd: '',
    updateTimeStart: '',
    updateTimeEnd: '',
    completeTimeStart: '',
    completeTimeEnd: '',
    tags: [],
    status: 0,
    priority: 0
  });

  async function handleSearch() {
    if (loading.value) {
      return;
    }
    // 重置
    loading.value = true;
    todoList.value = [];
    // 获取待办列表
    const {todoGroupView} = useTodoWrapStore();
    const {getTodoItemContent, getTodoItemAttr} = useTodoItemStore();
    const todoItems = todoGroupView.flatMap(e => e.children).flatMap(e => e.children)
    try {
      // 过滤待办列表
      for (let item of todoItems) {
        const {title, createTime, updateTime, status, priority} = item;
        const {
          title: formTitle,
          createTimeStart,
          createTimeEnd,
          updateTimeStart,
          updateTimeEnd,
          completeTimeStart,
          completeTimeEnd,
          status: formStatus,
          priority: formPriority,
          tags
        } = form.value;
        let hasCondition = false;
        if (formTitle !== '') {
          hasCondition = true;
          if (!title.includes(formTitle)) {
            continue;
          }
        }
        if (createTimeStart && createTimeStart !== '') {
          hasCondition = true;
          if (!dayjs(createTime).isAfter(createTimeStart, 'day')) {
            continue;
          }
        }
        if (createTimeEnd && createTimeEnd !== '') {
          hasCondition = true;
          if (!dayjs(createTime).isBefore(createTimeEnd, 'day')) {
            continue;
          }
        }
        if (updateTimeStart && updateTimeStart !== '') {
          hasCondition = true;
          if (!dayjs(updateTime).isAfter(updateTimeStart, 'day')) {
            continue;
          }
        }
        if (updateTimeEnd && updateTimeEnd !== '') {
          hasCondition = true;
          if (!dayjs(updateTime).isBefore(updateTimeEnd, 'day')) {
            continue;
          }
        }
        const attr = await getTodoItemAttr(item.id);
        const {completeTime} = attr;
        console.log(completeTime, completeTimeStart, completeTimeEnd);
        if (completeTimeStart && completeTimeStart !== '' && completeTime) {
          hasCondition = true;
          console.log(dayjs(completeTime).isAfter(completeTimeStart, 'day'))
          if (!dayjs(completeTime).isAfter(completeTimeStart, 'day')) {
            continue;
          }
        }
        if (completeTimeEnd && completeTimeEnd !== '' && completeTime) {
          hasCondition = true;
          if (!dayjs(completeTime).isBefore(completeTimeEnd, 'day')) {
            continue;
          }
        }
        if (formStatus > 0) {
          hasCondition = true;
          if (status !== formStatus) {
            continue;
          }
        }
        if (formPriority > 0) {
          hasCondition = true;
          if (priority !== formPriority) {
            continue;
          }
        }
        const contentDb = await getTodoItemContent(item.id);
        const content = contentDb.record;
        if (tags.length > 0) {
          hasCondition = true;
          // 标签过滤
          if (!tagSearch(content.tags, tags)) {
            continue;
          }
        }
        if (!hasCondition) {
          continue;
        }
        todoList.value.push({
          index: item,
          content: content,
          attr: attr
        });
      }
    } finally {
      loading.value = false;
    }
  }

  Drawer.open({
    title: '搜索待办事项',
    width: 700,
    footer: false,
    content: () => <div>
      <Row gutter={[8, 8]}>
        <Col span={11}>
          <Input placeholder="搜索待办事项" v-model={form.value.title} allowClear></Input>
        </Col>
        <Col span={4}>
          <Select v-model={form.value.status} placeholder="状态">
            <Option value={0}>全部状态</Option>
            <Option value={TodoItemStatus.TODO}>待办</Option>
            <Option value={TodoItemStatus.DOING}>进行中</Option>
            <Option value={TodoItemStatus.COMPLETE}>已完成</Option>
            <Option value={TodoItemStatus.ABANDON}>已放弃</Option>
          </Select>
        </Col>
        <Col span={4}>
          <Select v-model={form.value.priority} placeholder="优先级">
            <Option value={0}>全部优先级</Option>
            <Option value={TodoItemPriority.NONE}>无</Option>
            <Option value={TodoItemPriority.FLOOR}>低</Option>
            <Option value={TodoItemPriority.MIDDLE}>中</Option>
            <Option value={TodoItemPriority.HIGH}>高</Option>
          </Select>
        </Col>
        <Col span={3}>
          <div style="text-align: right">
            <Space>
              <Button type="primary" onClick={handleSearch}>搜索</Button>
              <Button type="primary" onClick={() => more.value = !more.value}>更多</Button>
            </Space>
          </div>
        </Col>
      </Row>
      {more.value && <div class={'mt-4'}>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <InputTag v-model={form.value.tags} placeholder="标签" allowClear></InputTag>
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="创建时间开始"
              v-model={form.value.createTimeStart}
              style="width: 100%"
              allowClear
            />
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="创建时间结束"
              v-model={form.value.createTimeEnd}
              style="width: 100%"
              allowClear
            />
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="更新时间开始"
              v-model={form.value.updateTimeStart}
              style="width: 100%"
              allowClear
            />
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="更新时间结束"
              v-model={form.value.updateTimeEnd}
              style="width: 100%"
              allowClear
            />
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="完成时间开始"
              v-model={form.value.completeTimeStart}
              style="width: 100%"
              allowClear
            />
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="完成时间结束"
              v-model={form.value.completeTimeEnd}
              style="width: 100%"
              allowClear
            />
          </Col>
        </Row>
      </div>}
      <List loading={loading.value} style="margin-top: 16px"
            paginationProps={{pageSize: 10, total: todoList.value.length}}>
        {todoList.value.map(item => (
          <ListItem key={item.index.id}>{{
            default: () => <>
              <div>{item.index.title}</div>
              <Space class={'mt-8'}>
                <Tag
                  color={handleSimplePriorityColor(item.index.priority)}>优先级：{handlePriorityText(item.index.priority)}</Tag>
                <Tag color={'arcoblue'}>状态：{handleStatusText(item.index.status)}</Tag>
              </Space>
              <Space class={'mt-8'}>
                <Tag
                  color={'orange'}>创建：{toDateString(item.index.createTime, 'YYYY-MM-DD HH:mm')}</Tag>
                <Tag
                  color={'purple'}>更新：{toDateString(item.index.updateTime, 'YYYY-MM-DD HH:mm')}</Tag>
                {item.index.status === TodoItemStatus.COMPLETE &&
                  item.attr.completeTime &&
                  <Tag
                    color={'green'}>完成：{toDateString(item.attr.completeTime, 'YYYY-MM-DD HH:mm')}</Tag>}
              </Space>
              <Divider/>
              <Space wrap>
                {item.content.tags.map(tag => <Tag key={tag} color={randomColor(tag)}>{tag}</Tag>)}
              </Space>
            </>,
            actions: () => <Button type="text"
                                   onClick={() => openTodoItemInfo(item.index)}>查看详情</Button>
          }}</ListItem>))
        }
      </List>
    </div>
  })
}
