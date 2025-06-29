import {
  DatePicker,
  Form,
  FormItem,
  DialogPlugin,
  RadioGroup,
  Textarea,
  RadioButton,
  DateRangePicker
} from "tdesign-vue-next";
import {handlePriorityColor, TodoItemPriority} from "@/entity/todo/TodoItem";
import MessageUtil from "@/utils/modal/MessageUtil";
import {TodoGroupView} from "@/entity/todo/TodoGroup";
import {useTodoWrapStore} from "@/store/components/TodoWrapStore";
import dayjs from "dayjs";
import {DialogOptions} from "tdesign-vue-next/es/dialog/type";

interface AddTodoItemProps {
  group?: TodoGroupView;
  priority?: TodoItemPriority;
  start?: string;
  end?: string;
  onAdd?: () => void;
  attach?: DialogOptions['attach']
}

/**
 * 打开新增待办对话框
 * @param props 参数
 */
export function openAddTodoItem(props?: AddTodoItemProps) {
  const {group, priority, start, end, onAdd, attach} = props || {};
  const record = ref({
    title: '',
    priority: priority || TodoItemPriority.NONE,
  });
  let startDate = undefined;
  if (start) {
    startDate = dayjs(start).format('YYYY-MM-DD');
  }
  const range = ref([startDate || '', end || startDate || '']);
  const isRange = ref(false);
  watch(() => range.value[0], (newValue) => {
    if (!isRange.value) {
      range.value[1] = newValue;
    }
  });
  const p = DialogPlugin({
    header: '新增待办',
    placement: 'center',
    attach,
    mode: window.innerWidth < 600 ? 'full-screen' : undefined,
    closeOnEscKeydown: false,
    default: () => <Form data={record.value} class={'pl-4px pr-4px'}>
      <FormItem label={'标题'} labelAlign={'top'}>
        <Textarea autosize={{minRows: 2, maxRows: 8}} v-model={record.value.title}
                  placeholder={'请输入待办内容'}/>
      </FormItem>
      <FormItem label={'优先级'} labelAlign={'top'}>
        <RadioGroup v-model={record.value.priority} variant={"default-filled"}>
          <RadioButton value={TodoItemPriority.HIGH}
                       style={{color: handlePriorityColor(TodoItemPriority.HIGH)}}>高优先级</RadioButton>
          <RadioButton value={TodoItemPriority.MIDDLE}
                       style={{color: handlePriorityColor(TodoItemPriority.MIDDLE)}}>中优先级</RadioButton>
          <RadioButton value={TodoItemPriority.FLOOR}
                       style={{color: handlePriorityColor(TodoItemPriority.FLOOR)}}>低优先级</RadioButton>
          <RadioButton value={TodoItemPriority.NONE}
                       style={{color: handlePriorityColor(TodoItemPriority.NONE)}}>无优先级</RadioButton>
        </RadioGroup>
      </FormItem>
      <FormItem labelAlign={'top'}>
        {{
          label: () => <RadioGroup v-model={isRange.value} variant={"default-filled"}>
            <RadioButton value={false}>时间</RadioButton>
            <RadioButton value={true}>时间段</RadioButton>
          </RadioGroup>,
          default: () => {
            if (isRange.value) {
              return <DateRangePicker allowInput={true} clearable={true} v-model={range.value}
                                      style={{marginTop: '6px'}}/>
            } else {
              return <DatePicker v-model={range.value[0]} style={{marginTop: '6px'}}/>
            }
          }
        }}
      </FormItem>
    </Form>,
    draggable: true,
    confirmBtn: '新增',
    async onConfirm() {
      try {
        await useTodoWrapStore().addItem(record.value, {
          start: range.value[0],
          end: range.value[1]
        }, group)
        MessageUtil.success("新增成功");
        p.destroy();
        onAdd && onAdd()
      } catch (e) {
        MessageUtil.error("新增失败", e);
      }

    }
  })
}
