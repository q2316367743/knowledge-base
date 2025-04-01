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

interface AddTodoItemProps {
  group?: TodoGroupView;
  priority?: TodoItemPriority;
  start?: string;
  end?: string;
}

/**
 * 打开新增待办对话框
 * @param props 参数
 */
export function openAddTodoItem(props?: AddTodoItemProps) {
  const {group, priority, start, end} = props || {};
  const record = ref({
    title: '',
    priority: priority || TodoItemPriority.NONE,
  });
  const range = ref([start || '', end || start || '']);
  const isRange = ref(false);
  watch(() => range.value[0], (newValue) => {
    if (!isRange.value) {
      range.value[1] = newValue;
    }
  });
  const p = DialogPlugin({
    header: '新增待办',
    default: () => <Form data={record.value}>
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
                                      class={'mt-6px'}></DateRangePicker>
            } else {
              return <DatePicker v-model={range.value[0]} class={'mt-6px'}></DatePicker>
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
        return true;
      } catch (e) {
        MessageUtil.error("新增失败", e);
        return false;
      }

    }
  })
}
