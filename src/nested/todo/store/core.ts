import dayjs from 'dayjs';
import {useTodoItemStore} from "@/store";
import {TodoItem} from '@/entity/todo/TodoItem';
import {currentDay} from "@/nested/todo/store/date";

// 获取待办项

// 获取当天的待办项
export const todayItems = ref<TodoItem[]>([]);
export const loading = ref(true);

export async function updateTodayItems(): Promise<void> {
  const selectedDate = dayjs(currentDay.value);
  const startOfDay = selectedDate.startOf('day').valueOf();
  const endOfDay = selectedDate.endOf('day').valueOf();

  const todayTodoItems: TodoItem[] = [];
  const {items} = useTodoItemStore();

  for (const item of items) {
    try {
      const todoItem = await useTodoItemStore().getTodoItem(item.id);
      const startTime = todoItem.attr.start ? new Date(todoItem.attr.start).getTime() : todoItem.index.id;
      const endTime = todoItem.attr.end ? new Date(todoItem.attr.end).getTime() : startTime;

      // 判断待办项是否在当天范围内
      if ((startTime <= endOfDay && endTime >= startOfDay)) {
        todayTodoItems.push(todoItem);
      }
    } catch (e) {
      console.error('获取待办项详情失败', e);
    }
  }

  todayTodoItems.sort((a, b) => (b.index.top ? 1 : 0) - (a.index.top ? 1 : 0))

  todayItems.value = todayTodoItems;
}