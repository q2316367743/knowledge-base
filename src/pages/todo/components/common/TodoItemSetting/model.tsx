import {TodoItemAttr, TodoItemIndex} from "@/entity/todo/TodoItem";
import {useUmami} from "@/plugin/umami";
import {
  Button, DatePicker, Divider,
  Drawer,
  Input, Popconfirm,
  Radio,
  RadioGroup, RangePicker,
  Space,
  Trigger
} from "@arco-design/web-vue";
import {useTodoStore} from "@/store/components/TodoStore";
import {clone} from "@/utils/lang/ObjectUtil";
import MessageUtil from "@/utils/modal/MessageUtil";
import RichTextEditor from "@/editor/RichTextEditor/index.vue";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import TodoItemCheckbox from "@/components/TodoItemCheckbox/TodoItemCheckbox.vue";
import PriorityDropdown from "@/components/PriorityDropdown/PriorityDropdown.vue";
import TagGroup from "@/components/TagGroup/TagGroup.vue";
import DateRange from "@/components/DateRange/DateRange.vue";
import './model.less';

function renderIsRange(attr: TodoItemAttr): boolean {
  if (attr.start === '' && attr.end === '') {
    return false;
  }
  return attr.start !== attr.end;

}

export async function openTodoItemSetting(index: TodoItemIndex, toUpdate?: (index: TodoItemIndex) => void) {
  useUmami.track("/待办/操作/编辑卡片信息")

  const base = ref(clone(index, true));
  const todoItem = await useTodoItemStore().getTodoItem(index.id);
  const content = ref(todoItem.content);
  const isRange = ref(renderIsRange(todoItem.attr));
  const range = ref([todoItem.attr.start, todoItem.attr.end]);

  watch(() => range.value[0], (newValue) => {
    if (!isRange.value) {
      range.value[1] = newValue;
    }
  })

  function onClose() {
    open.close();
  }

  async function onBeforeOk() {
    // 先更新索引
    await useTodoStore().updateById(index.id, base.value, {
      ...todoItem.attr,
      start: range.value ? range.value[0] : undefined,
      end: range.value ? range.value[1] : undefined
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
    header: false,
    maskClosable: true,
    content: () => <div class={'todo-item-setting'}>
      <div class={'todo-item-setting__header'}>
        <TodoItemCheckbox priority={base.value.priority} status={base.value.status}/>
        <div>
          <Trigger position={isRange.value ? 'bottom' : 'bl'} auto-fit-position trigger="click" showArrow={true} popupTranslate={[0, 10]}>{{
            default: () => <Button size={'small'}>
              <DateRange start={range.value[0]} end={range.value[1]}/>
            </Button>,
            content: () => <div class={'todo-item-setting__date'}>
              <div>
                <RadioGroup v-model={isRange.value} type={'button'}>
                  <Radio value={false}>时间</Radio>
                  <Radio value={true}>时间段</Radio>
                </RadioGroup>
              </div>
              <div style={{marginTop: '8px'}}>
                {isRange.value ? <RangePicker v-model={range.value}></RangePicker> :
                  <DatePicker v-model={range.value[0]}></DatePicker>}
              </div>
            </div>
          }}</Trigger>
        </div>
        <PriorityDropdown v-model={base.value.priority}/>
      </div>
      <Divider margin={2}/>
      <div class={'todo-item-setting__input'}>
        <Input v-model={base.value.title}/>
      </div>
      <div class={'todo-item-setting__content'}>
        <RichTextEditor v-model={content.value.record.content} simple={true}/>
      </div>
      <div class={'todo-item-setting__tag'}>
        <TagGroup v-model={content.value.record.tags}/>
      </div>
    </div>,
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

