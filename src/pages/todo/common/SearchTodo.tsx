import {
  Button,
  Col,
  DatePicker,
  DrawerPlugin,
  Input,
  List,
  ListItem, Loading,
  Option,
  Row,
  Select,
  Space,
  Tag,
  TagInput
} from 'tdesign-vue-next';
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
import {useTodoItemStore, useTodoWrapStore} from "@/store";
import {toDateTimeString} from "@/utils/lang/FormatUtil";
import {randomColor} from "@/utils/BrowserUtil";
import {openTodoItemSetting} from "@/pages/todo/common/TodoItemSetting/model";

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

export function searchTodo() {
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
        if (completeTimeStart && completeTimeStart !== '' && completeTime) {
          hasCondition = true;
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

  DrawerPlugin({
    header: '搜索待办事项',
    size: '700px',
    footer: false,
    default: () => <div>
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <Input placeholder="搜索待办事项" v-model={form.value.title} clearable={true}></Input>
        </Col>
        <Col span={4}>
          <Select v-model={form.value.status} placeholder="状态">
            <Option value={0} label={'全部状态'}/>
            <Option value={TodoItemStatus.TODO} label={'待办'}/>
            <Option value={TodoItemStatus.DOING} label={'进行中'}/>
            <Option value={TodoItemStatus.COMPLETE} label={'已完成'}/>
            <Option value={TodoItemStatus.ABANDON} label={'已放弃'}/>
          </Select>
        </Col>
        <Col span={4}>
          <Select v-model={form.value.priority} placeholder="优先级">
            <Option value={0} label={'全部优先级'}/>
            <Option value={TodoItemPriority.HIGH} label={'高'}/>
            <Option value={TodoItemPriority.MIDDLE} label={'中'}/>
            <Option value={TodoItemPriority.FLOOR} label={'低'}/>
            <Option value={TodoItemPriority.NONE} label={'无'}/>
          </Select>
        </Col>
        <Col span={4}>
          <div style="text-align: right">
            <Space size={'small'}>
              <Button theme="primary" onClick={handleSearch}>搜索</Button>
              <Button theme="default" onClick={() => more.value = !more.value}>更多</Button>
            </Space>
          </div>
        </Col>
      </Row>
      {more.value && <div class={'mt-4'}>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <TagInput v-model={form.value.tags} placeholder="标签" clearable={true}></TagInput>
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="创建时间开始"
              v-model={form.value.createTimeStart}
              style="width: 100%"
              clearable={true}
            />
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="创建时间结束"
              v-model={form.value.createTimeEnd}
              style="width: 100%"
              clearable={true}
            />
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="更新时间开始"
              v-model={form.value.updateTimeStart}
              style="width: 100%"
              clearable={true}
            />
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="更新时间结束"
              v-model={form.value.updateTimeEnd}
              style="width: 100%"
              clearable={true}
            />
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="完成时间开始"
              v-model={form.value.completeTimeStart}
              style="width: 100%"
              clearable={true}
            />
          </Col>
          <Col span={6}>
            <DatePicker
              placeholder="完成时间结束"
              v-model={form.value.completeTimeEnd}
              style="width: 100%"
              clearable={true}
            />
          </Col>
        </Row>
      </div>}
      <Loading loading={loading.value} text={'搜索中'}>
        <List style="margin-top: 16px" split={true}>
          {todoList.value.map(item => (
            <ListItem key={item.index.id}>{{
              default: () => <div class={'flex flex-col'}>
                <div onClick={() => openTodoItemSetting(item.index)}
                     style={{color: 'rgb(var(--arcoblue-6))', cursor: 'pointer'}}>{item.index.title}</div>
                <Space class={'mt-8'} size={'small'}>
                  <Tag
                    color={handleSimplePriorityColor(item.index.priority)}>优先级：{handlePriorityText(item.index.priority)}</Tag>
                  <Tag color={'blue'}>状态：{handleStatusText(item.index.status)}</Tag>
                </Space>
                <Space class={'mt-8'} size={'small'}>
                  <Tag
                    color={'orange'}>创建：{toDateTimeString(item.index.createTime, 'YYYY-MM-DD HH:mm')}</Tag>
                  <Tag
                    color={'purple'}>更新：{toDateTimeString(item.index.updateTime || item.index.createTime, 'YYYY-MM-DD HH:mm')}</Tag>
                  {item.index.status === TodoItemStatus.COMPLETE &&
                    item.attr.completeTime &&
                    <Tag
                      color={'green'}>完成：{toDateTimeString(item.attr.completeTime, 'YYYY-MM-DD HH:mm')}</Tag>}
                </Space>
                {item.attr.tags.length > 0 && <>
                  <Space style={{marginTop: '8px'}} size={'small'}>
                    {item.attr.tags.map(tag => <Tag key={tag} color={randomColor(tag)}>{tag}</Tag>)}
                  </Space>
                </>}
              </div>,
            }}</ListItem>))
          }
        </List>
      </Loading>
    </div >
  })
}
