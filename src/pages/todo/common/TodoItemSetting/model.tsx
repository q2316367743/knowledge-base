import {
  Button, Checkbox,
  DatePicker, DateRangePicker, DrawerPlugin,
  Input, Popconfirm, Popup,
  RadioButton, RadioGroup, Space
} from "tdesign-vue-next";
import {TodoItemAttr, TodoItemIndex, TodoItemStatus} from "@/entity/todo/TodoItem";
import {useUmami} from "@/plugin/umami";
import {clone} from "@/utils/lang/ObjectUtil";
import {useTodoItemStore} from "@/store/db/TodoItemStore";
import MessageUtil from "@/utils/modal/MessageUtil";
import RichTextEditor from "@/editor/RichTextEditor/index.vue";
import TodoItemCheckbox from "@/components/TodoItemCheckbox/TodoItemCheckbox.vue";
import PriorityDropdown from "@/components/PriorityDropdown/PriorityDropdown.vue";
import TagGroup from "@/components/TagGroup/TagGroup.vue";
import DateRange from '@/components/DateRange/DateRange.vue';
import './model.less';
import {DrawerOptions} from "tdesign-vue-next/es/drawer/type";
import {InjectionUtil} from "@/utils/utools/InjectionUtil";

function renderIsRange(attr: TodoItemAttr): boolean {
  if (attr.start === '' && attr.end === '') {
    return false;
  }
  return attr.start !== attr.end;

}

export function openTodoItemSetting(index: TodoItemIndex, toUpdate?: (index: TodoItemIndex) => void) {
  return openTodoItemInfo({
    index,
    toUpdate,
    preview: index.status === TodoItemStatus.ABANDON || index.status === TodoItemStatus.COMPLETE
  });
}

interface TodoItemInfoProps {
  index: TodoItemIndex;
  toUpdate?: (index: TodoItemIndex) => void;
  attach?: DrawerOptions['attach'];
  // 是否预览
  preview?: boolean;
}

export async function openTodoItemInfo(props: TodoItemInfoProps) {
  const {index, attach, preview = false, toUpdate} = props;
  useUmami.track("/待办/操作/编辑卡片信息")

  const base = ref(clone(index, true));
  const todoItem = await useTodoItemStore().getTodoItem(index.id);
  const attr = ref(todoItem.attr);
  const content = ref(todoItem.content);
  const isRange = ref(renderIsRange(todoItem.attr));
  const range = ref([todoItem.attr.start, todoItem.attr.end]);

  watch(() => range.value[0], (newValue) => {
    if (!isRange.value) {
      range.value[1] = newValue;
    }
  })

  function onClose() {
    open.destroy?.();
  }

  async function onBeforeOk() {
    // 先更新索引
    await useTodoItemStore().updateById(index.id, base.value, {
      ...todoItem.attr,
      start: range.value ? range.value[0] : undefined,
      end: range.value ? range.value[1] : undefined,
      tags: attr.value.tags
    });
    // 再更新属性
    // 再更新内容
    await useTodoItemStore().saveContent(index.id, content.value.record, content.value.rev);
    MessageUtil.success("保存成功");
    onClose();
    toUpdate && toUpdate(base.value);
  }

  function onRemove() {
    useTodoItemStore().deleteById(index.id)
      .then(() => {
        MessageUtil.success("删除成功");
        onClose();
      })
      .catch(e => MessageUtil.error("删除失败", e));
  }

  const windowType = InjectionUtil.window.getWindowType();

  const open = DrawerPlugin({
    header: false,
    attach,
    size: window.innerWidth < 600 ? '100vw' : '59vw',
    closeOnOverlayClick: true,
    className: 'abs-drawer',
    default: () => <div class={'todo-item-setting'}>
      <div class={'todo-item-setting__header'}>
        <TodoItemCheckbox priority={base.value.priority} v-model:status={base.value.status} readonly={preview}/>
        <div class={'ml-8px'}>
          <Popup placement={'bottom'} trigger={"click"} showArrow={true}>{{
            default: () => <Button size={'small'}>
              <DateRange start={range.value[0]} end={range.value[1]}/>
            </Button>,
            content: () => <div class={'todo-item-setting__date'}>
              <div>
                <RadioGroup v-model={isRange.value} variant={"default-filled"} readonly={preview}>
                  <RadioButton value={false}>时间</RadioButton>
                  <RadioButton value={true}>时间段</RadioButton>
                </RadioGroup>
              </div>
              <div style={{marginTop: '8px'}}>
                {isRange.value ? <DateRangePicker v-model={range.value} clearable={true} readonly={preview}/> :
                  <DatePicker v-model={range.value[0]} clearable={true} readonly={preview}/>}
              </div>
            </div>
          }}</Popup>
        </div>
        <div class={'ml-8px'}>
          <Checkbox v-model={base.value.top} readonly={preview}>置顶</Checkbox>
        </div>
        <div style={{marginLeft: 'auto'}}>
          <PriorityDropdown v-model={base.value.priority} readonly={preview}/>
        </div>
      </div>
      <div class={'todo-item-setting__input'}>
        <Input v-model={base.value.title} readonly={preview}/>
      </div>
      <div class={['todo-item-setting__content', windowType]}>
        <RichTextEditor v-model={content.value.record.content} simple={true} readOnly={preview}/>
      </div>
      <div class={'todo-item-setting__tag'}>
        <TagGroup v-model={attr.value.tags} readonly={preview}/>
      </div>
    </div>,
    footer: () => <div style={{display: 'flex', justifyContent: 'space-between'}}>
      <Popconfirm content={'是否删除此待办，删除后不可恢复'} onConfirm={onRemove} confirmBtn={{
        default: '删除', theme: 'danger'
      }}>
        <Button theme={'danger'}>删除</Button>
      </Popconfirm>
      <Space>
        <Button theme={'default'} onClick={onClose}>取消</Button>
        <Button theme={'primary'} onClick={onBeforeOk}>保存</Button>
      </Space>
    </div>
  });
}

